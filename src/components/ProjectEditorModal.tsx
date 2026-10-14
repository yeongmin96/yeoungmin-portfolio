import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { X } from 'lucide-react';
import {
  defaultArchiveProjects,
  type ArchiveImage,
  type ArchiveProject,
  type FilmProject,
  type VisualArchiveProject,
  type VisualWorkSection,
  type WorkSection,
} from '../data/archive';
import { createArchiveProjectId } from '../hooks/useArchiveProjects';
import { createStoredArchiveImage } from '../lib/imageFiles';

type ProjectEditorModalProps = {
  section: WorkSection;
  project?: ArchiveProject;
  onCancel: () => void;
  onSave: (project: ArchiveProject) => boolean;
};

function parseYouTubeId(raw: string): string | null | undefined {
  const value = raw.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    if (url.protocol !== 'https:') return undefined;

    let videoId = '';
    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? '';
    } else if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      videoId = url.searchParams.get('v') ?? '';
      if (!videoId) {
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') videoId = parts[1] ?? '';
      }
    } else {
      return undefined;
    }

    return /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : undefined;
  } catch {
    return undefined;
  }
}

function youtubeWatchUrl(project?: ArchiveProject): string {
  return project?.kind === 'film' && project.youtubeVideoId
    ? `https://www.youtube.com/watch?v=${project.youtubeVideoId}`
    : '';
}

function fieldClassName() {
  return 'mt-2 w-full border border-espresso/25 bg-white/70 px-3 py-3 text-base text-espresso outline-none transition-colors placeholder:text-espresso/35 focus:border-terracotta focus:ring-1 focus:ring-terracotta sm:text-sm';
}

function labelClassName() {
  return 'block text-[10px] uppercase tracking-[0.16em] text-espresso/70';
}

function FileAttachLabel({ htmlFor, children, disabled }: { htmlFor: string; children: string; disabled: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      aria-disabled={disabled}
      className={`inline-flex min-h-11 cursor-pointer items-center border border-espresso/35 px-4 text-[10px] uppercase tracking-[0.14em] text-espresso transition-colors hover:border-terracotta hover:text-terracotta ${disabled ? 'pointer-events-none opacity-45' : ''}`}
    >
      {children}
    </label>
  );
}

export default function ProjectEditorModal({ section, project, onCancel, onSave }: ProjectEditorModalProps) {
  const generatedId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const uploadingRef = useRef(false);
  const [title, setTitle] = useState(project?.title ?? '');
  const [coverImage, setCoverImage] = useState<ArchiveImage | null>(project?.kind === 'visual' ? project.cover : null);
  const [thumbnailImage, setThumbnailImage] = useState<ArchiveImage | null>(project?.kind === 'film' ? project.image : null);
  const [detailImages, setDetailImages] = useState<ArchiveImage[]>(project?.kind === 'visual'
    ? project.images.filter((image) => image.id !== project.cover.id && image.src !== project.cover.src)
    : []);
  const [projectNote, setProjectNote] = useState(project?.kind === 'visual' ? project.projectNote ?? '' : '');
  const [youtubeUrl, setYoutubeUrl] = useState(youtubeWatchUrl(project));
  const [roleCredits, setRoleCredits] = useState(project?.kind === 'film' ? project.roleCredits ?? '' : '');
  const [synopsis, setSynopsis] = useState(project?.kind === 'film' ? project.synopsis ?? '' : '');
  const [productionYear, setProductionYear] = useState(project?.kind === 'film' ? project.productionYear ?? '' : '');
  const [runtime, setRuntime] = useState(project?.kind === 'film' ? project.runtime ?? '' : '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const titleId = `project-title-${generatedId}`;
  const fallbackFilm = defaultArchiveProjects.find((entry): entry is FilmProject => entry.kind === 'film');

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !uploadingRef.current) {
        event.preventDefault();
        onCancel();
      }
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [onCancel]);

  async function attachCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    setError('');
    setUploading(true);
    uploadingRef.current = true;
    try {
      const image = await createStoredArchiveImage(file, title.trim() || 'Project', 1);
      if (section === 'FILM & DRAMA') setThumbnailImage(image);
      else setCoverImage(image);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'The selected photo could not be processed.');
    } finally {
      uploadingRef.current = false;
      setUploading(false);
    }
  }

  async function attachDetails(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';
    if (!files.length) return;
    setError('');
    setUploading(true);
    uploadingRef.current = true;
    try {
      const prepared: ArchiveImage[] = [];
      for (const [index, file] of files.entries()) {
        prepared.push(await createStoredArchiveImage(file, title.trim() || 'Project', detailImages.length + index + 2));
      }
      setDetailImages((current) => [...current, ...prepared]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'One or more selected photos could not be processed.');
    } finally {
      uploadingRef.current = false;
      setUploading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (uploading) {
      setError('Wait for the selected photos to finish preparing before saving.');
      return;
    }
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Please enter a project title.');
      return;
    }

    const id = project?.id ?? createArchiveProjectId();
    if (section === 'FILM & DRAMA') {
      const youtubeVideoId = parseYouTubeId(youtubeUrl);
      if (youtubeVideoId === undefined) {
        setError('Enter a valid HTTPS YouTube video link (youtu.be or youtube.com).');
        return;
      }
      const filmProject: FilmProject = {
        kind: 'film',
        id,
        section: 'FILM & DRAMA',
        category: project?.kind === 'film' ? project.category : 'FILM & DRAMA',
        title: cleanTitle,
        roleCredits: roleCredits.trim() || null,
        synopsis: synopsis.trim() || null,
        productionYear: productionYear.trim() || null,
        runtime: runtime.trim() || null,
        youtubeVideoId,
        videoSrc: project?.kind === 'film' ? project.videoSrc : null,
        image: thumbnailImage ?? fallbackFilm!.image,
      };
      if (!onSave(filmProject)) setError('The browser could not save this project. Reduce the number or size of attached photos and try again.');
      return;
    }

    if (!coverImage) {
      setError('Attach one cover photo before saving this project.');
      return;
    }

    const visualProject: VisualArchiveProject = {
      kind: 'visual',
      id,
      section: section as VisualWorkSection,
      title: cleanTitle,
      cover: coverImage,
      images: [coverImage, ...detailImages],
      coverRatio: project?.kind === 'visual' ? project.coverRatio : (section === 'SET STILLS' ? 'landscape' : 'portrait'),
      projectNote: projectNote.trim() || null,
    };
    if (!onSave(visualProject)) setError('The browser could not save this project. Reduce the number or size of attached photos and try again.');
  }

  const filmThumbnailPreview = thumbnailImage ?? fallbackFilm?.image ?? null;
  const coverInputId = `${titleId}-cover-file`;
  const detailsInputId = `${titleId}-details-files`;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-espresso/35 p-3 sm:p-6"
      onMouseDown={(event) => { if (event.target === event.currentTarget && !uploadingRef.current) onCancel(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[92dvh] w-full max-w-[680px] overflow-y-auto border border-espresso/20 bg-[#EFECE6] p-5 shadow-[0_20px_70px_rgba(35,32,29,0.18)] sm:p-8"
      >
        <div className="mb-7 flex items-start justify-between gap-5 border-b border-espresso/20 pb-5">
          <div>
            <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-espresso/55">{section}</p>
            <h2 id={titleId} className="font-serif text-3xl font-light text-espresso sm:text-4xl">
              {project ? 'Edit Project' : 'Add Project'}
            </h2>
          </div>
          <button type="button" onClick={onCancel} disabled={uploading} aria-label="Close project editor" className="grid h-10 w-10 shrink-0 place-items-center text-espresso/70 hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta disabled:opacity-40">
            <X size={20} strokeWidth={1.3} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label htmlFor={`${titleId}-input`} className={labelClassName()}>
            Project Title <span aria-hidden="true">*</span>
            <input id={`${titleId}-input`} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required className={fieldClassName()} placeholder="Enter a title" />
          </label>

          {section !== 'FILM & DRAMA' ? (
            <>
              <div>
                <p className={labelClassName()}>Main Cover Photo <span aria-hidden="true">*</span></p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <FileAttachLabel htmlFor={coverInputId} disabled={uploading}>Attach one cover photo</FileAttachLabel>
                  <input id={coverInputId} type="file" accept="image/*" disabled={uploading} onChange={attachCover} className="sr-only" aria-label="Attach one main cover photo" />
                  {coverImage && <div className="h-28 w-24 overflow-hidden border border-espresso/20 bg-white/50"><img src={coverImage.src} alt="Cover preview" className="h-full w-full object-cover" /></div>}
                </div>
                {!coverImage && <p className="mt-2 text-[10px] leading-relaxed text-espresso/55">Choose one image from this device. A cover photo is required.</p>}
              </div>

              <div>
                <p className={labelClassName()}>Detail Photos</p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <FileAttachLabel htmlFor={detailsInputId} disabled={uploading}>Attach detail photos</FileAttachLabel>
                  <input id={detailsInputId} type="file" accept="image/*" multiple disabled={uploading} onChange={attachDetails} className="sr-only" aria-label="Attach multiple detail photos" />
                  <span className="text-[10px] text-espresso/55">Select multiple files at once</span>
                </div>
                {detailImages.length > 0 && (
                  <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {detailImages.map((image, index) => (
                      <li key={image.id} className="relative aspect-square overflow-hidden border border-espresso/15 bg-white/50">
                        <img src={image.src} alt={`Detail photo ${index + 1} preview`} className="h-full w-full object-cover" />
                        <button type="button" disabled={uploading} onClick={() => setDetailImages((current) => current.filter((item) => item.id !== image.id))} aria-label={`Remove detail photo ${index + 1}`} className="absolute right-1 top-1 grid h-8 w-8 place-items-center bg-[#EFECE6]/95 text-base text-espresso shadow-sm disabled:opacity-40">×</button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-[10px] leading-relaxed text-espresso/55">New photos are added to the project. Remove any preview above to leave it out.</p>
              </div>

              <label htmlFor={`${titleId}-note`} className={labelClassName()}>
                Project Note
                <textarea id={`${titleId}-note`} value={projectNote} onChange={(event) => setProjectNote(event.target.value)} rows={3} maxLength={1200} className={fieldClassName()} placeholder="A short note from the artist about this project" />
              </label>
            </>
          ) : (
            <>
              <label htmlFor={`${titleId}-youtube`} className={labelClassName()}>
                YouTube URL
                <input id={`${titleId}-youtube`} value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} inputMode="url" className={fieldClassName()} placeholder="https://www.youtube.com/watch?v=…" />
              </label>
              <div>
                <p className={labelClassName()}>Custom Thumbnail Photo</p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <FileAttachLabel htmlFor={coverInputId} disabled={uploading}>Attach thumbnail photo</FileAttachLabel>
                  <input id={coverInputId} type="file" accept="image/*" disabled={uploading} onChange={attachCover} className="sr-only" aria-label="Attach custom video thumbnail photo" />
                  {thumbnailImage && <button type="button" disabled={uploading} onClick={() => setThumbnailImage(null)} className="min-h-11 px-2 text-[10px] uppercase tracking-[0.12em] text-espresso/65 underline underline-offset-4 disabled:opacity-40">Use default thumbnail</button>}
                </div>
                {filmThumbnailPreview && <div className="mt-3 aspect-video max-w-md overflow-hidden border border-espresso/15 bg-white/50"><img src={filmThumbnailPreview.src} alt="Video thumbnail preview" className="h-full w-full object-cover" /></div>}
                <p className="mt-2 text-[10px] leading-relaxed text-espresso/55">Optional. The attached thumbnail is stored in this browser and shown on the film card.</p>
              </div>
              <label htmlFor={`${titleId}-credits`} className={labelClassName()}>
                Role / Credits
                <input id={`${titleId}-credits`} value={roleCredits} onChange={(event) => setRoleCredits(event.target.value)} className={fieldClassName()} placeholder="e.g. Director of Photography / 촬영감독" />
              </label>
              <label htmlFor={`${titleId}-synopsis`} className={labelClassName()}>
                Synopsis
                <textarea id={`${titleId}-synopsis`} value={synopsis} onChange={(event) => setSynopsis(event.target.value)} rows={4} className={fieldClassName()} placeholder="Synopsis and creative intent" />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label htmlFor={`${titleId}-year`} className={labelClassName()}>
                  Production Year
                  <input id={`${titleId}-year`} value={productionYear} onChange={(event) => setProductionYear(event.target.value)} maxLength={30} className={fieldClassName()} placeholder="2025" />
                </label>
                <label htmlFor={`${titleId}-runtime`} className={labelClassName()}>
                  Runtime
                  <input id={`${titleId}-runtime`} value={runtime} onChange={(event) => setRuntime(event.target.value)} maxLength={30} className={fieldClassName()} placeholder="12 min" />
                </label>
              </div>
            </>
          )}

          {uploading && <p role="status" className="text-xs text-espresso/70">Preparing and compressing photos on this device…</p>}
          {error && <p role="alert" className="border border-red-800/25 bg-red-900/5 px-3 py-2 text-xs text-red-900">{error}</p>}
          <p className="text-[10px] leading-relaxed text-espresso/55">Photos are resized and saved as Base64 in this browser only; they are not uploaded or synced. The archive has a 4 MiB local storage budget.</p>
          <div className="sticky bottom-0 z-10 -mx-5 mt-1 flex flex-col-reverse justify-end gap-2 border-t border-espresso/20 bg-[#EFECE6]/95 px-5 pb-1 pt-4 shadow-[0_-12px_18px_-18px_rgba(35,32,29,0.35)] sm:-mx-8 sm:flex-row sm:gap-3 sm:px-8">
            <button type="button" disabled={uploading} onClick={onCancel} className="min-h-12 border border-espresso/35 bg-transparent px-5 text-xs uppercase tracking-[0.12em] text-espresso/75 transition-colors hover:bg-espresso/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta disabled:opacity-40">Cancel</button>
            <button type="submit" disabled={uploading} className="min-h-12 border border-[#23201D] bg-[#23201D] px-7 text-xs font-medium uppercase tracking-[0.16em] text-white transition-colors hover:border-terracotta hover:bg-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-wait disabled:opacity-55">{uploading ? 'Preparing…' : project ? 'Save' : 'Save Project'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
