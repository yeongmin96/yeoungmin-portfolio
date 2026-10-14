import type { ArchiveImage } from '../data/archive';

const MAX_SOURCE_FILE_BYTES = 24 * 1024 * 1024;
const MAX_IMAGE_EDGE = 2000;
const MAX_COMPRESSED_BYTES = 320 * 1024;
const SCALE_STEPS = [1, 0.86, 0.72, 0.6, 0.5] as const;
const QUALITY_STEPS = [0.82, 0.74, 0.66] as const;

type LoadedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  dispose: () => void;
};

function loadImage(file: File): Promise<LoadedImage> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file)
      .then((bitmap) => ({
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      }))
      .catch(() => loadImageElement(file));
  }
  return loadImageElement(file);
}

function loadImageElement(file: File): Promise<LoadedImage> {
  const objectUrl = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      dispose: () => URL.revokeObjectURL(objectUrl),
    });
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('This image format is not supported by this browser. Choose a JPEG, PNG, or WebP photo.'));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('The browser could not prepare this photo for local storage.'));
    }, type, quality);
  });
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string'
      ? resolve(reader.result)
      : reject(new Error('The browser could not read the prepared photo.'));
    reader.onerror = () => reject(new Error('The browser could not read the prepared photo.'));
    reader.readAsDataURL(blob);
  });
}

function uniqueId(): string {
  const random = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `local-photo-${random.toLowerCase()}`;
}

/** Compresses a selected photo locally; the original file is never uploaded. */
export async function createStoredArchiveImage(file: File, title: string, index: number): Promise<ArchiveImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose an image file.');
  }
  if (file.size === 0 || file.size > MAX_SOURCE_FILE_BYTES) {
    throw new Error('Each original photo must be smaller than 24 MiB.');
  }

  const loaded = await loadImage(file);
  const canvas = document.createElement('canvas');
  try {
    if (loaded.width < 1 || loaded.height < 1) {
      throw new Error('The selected file does not contain a readable photo.');
    }

    const baseScale = Math.min(1, MAX_IMAGE_EDGE / Math.max(loaded.width, loaded.height));
    let smallestBlob: Blob | null = null;

    for (const step of SCALE_STEPS) {
      const scale = baseScale * step;
      canvas.width = Math.max(1, Math.round(loaded.width * scale));
      canvas.height = Math.max(1, Math.round(loaded.height * scale));
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) throw new Error('The browser could not prepare a photo canvas.');
      context.fillStyle = '#EFECE6';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(loaded.source, 0, 0, canvas.width, canvas.height);

      for (const quality of QUALITY_STEPS) {
        let blob = await canvasToBlob(canvas, 'image/webp', quality);
        if (blob.type.toLowerCase() !== 'image/webp') {
          blob = await canvasToBlob(canvas, 'image/jpeg', quality);
        }
        if (!smallestBlob || blob.size < smallestBlob.size) smallestBlob = blob;
        if (blob.size <= MAX_COMPRESSED_BYTES) {
          const src = await readBlobAsDataUrl(blob);
          const photoNumber = String(index).padStart(2, '0');
          return {
            id: uniqueId(),
            src,
            alt: `${title} · photo ${photoNumber}`,
            caption: `${title} · ${photoNumber}`,
            credit: 'Attached by the artist · stored in this browser',
          };
        }
      }
    }

    if (!smallestBlob || smallestBlob.size > MAX_COMPRESSED_BYTES) {
      throw new Error('This photo is still too large after compression. Choose a smaller image file.');
    }
    const src = await readBlobAsDataUrl(smallestBlob);
    const photoNumber = String(index).padStart(2, '0');
    return {
      id: uniqueId(),
      src,
      alt: `${title} · photo ${photoNumber}`,
      caption: `${title} · ${photoNumber}`,
      credit: 'Attached by the artist · stored in this browser',
    };
  } finally {
    loaded.dispose();
    canvas.width = 0;
    canvas.height = 0;
  }
}
