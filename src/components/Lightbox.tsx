import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ArchiveImage } from '../data/archive';

type LightboxProps = {
  images: ArchiveImage[];
  index: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function Lightbox({ images, index, onClose, onPrevious, onNext }: LightboxProps) {
  const reduceMotion = useReducedMotion();
  const image = images[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const callbacksRef = useRef({ onClose, onPrevious, onNext });
  callbacksRef.current = { onClose, onPrevious, onNext };

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        callbacksRef.current.onClose();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        callbacksRef.current.onPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        callbacksRef.current.onNext();
      } else if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
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
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  if (!image) return null;

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} viewer`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      onMouseDown={(event) => { if (event.target === event.currentTarget) callbacksRef.current.onClose(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-espresso/95 p-4 text-sand backdrop-blur-sm sm:p-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.985, y: reduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.985 }}
        transition={{ duration: reduceMotion ? 0 : 0.22 }}
        className="flex max-h-full max-w-6xl flex-col items-center"
      >
        <img src={image.src} alt={image.alt} className="max-h-[76vh] max-w-[88vw] object-contain sm:max-h-[80vh]" />
        <div className="flex w-full justify-end pt-4 sm:pt-5">
          <span className="shrink-0 pt-1 text-[10px] tabular-nums tracking-[0.15em] text-sand/60">{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
        </div>
      </motion.div>

      <button ref={closeButtonRef} type="button" onClick={() => callbacksRef.current.onClose()} aria-label="Close image viewer" className="absolute right-4 top-4 grid h-11 w-11 place-items-center border border-sand/35 text-sand transition-colors hover:bg-sand hover:text-espresso sm:right-8 sm:top-8">
        <X size={20} strokeWidth={1.25} aria-hidden="true" />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" onClick={() => callbacksRef.current.onPrevious()} aria-label="Previous image" className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-sand/35 text-sand transition-colors hover:bg-sand hover:text-espresso sm:left-8 sm:h-12 sm:w-12">
            <ChevronLeft size={22} strokeWidth={1.2} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => callbacksRef.current.onNext()} aria-label="Next image" className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-sand/35 text-sand transition-colors hover:bg-sand hover:text-espresso sm:right-8 sm:h-12 sm:w-12">
            <ChevronRight size={22} strokeWidth={1.2} aria-hidden="true" />
          </button>
        </>
      )}
    </motion.div>
  );
}
