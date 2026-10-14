import { motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { menuItems, type MenuTarget } from '../data/archive';

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (selection: MenuTarget) => void;
};

export default function MenuOverlay({ open, onClose, onSelect }: MenuOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const pendingSelectionRef = useRef<MenuTarget | null>(null);
  const reduceMotion = useReducedMotion();
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback((selection?: MenuTarget) => {
    if (closingRef.current) return;
    closingRef.current = true;
    pendingSelectionRef.current = selection ?? null;
    setClosing(true);
  }, []);

  const completeClose = () => {
    if (!closingRef.current) return;
    closingRef.current = false;
    const selection = pendingSelectionRef.current;
    pendingSelectionRef.current = null;
    if (selection) onSelect(selection);
    else onClose();
  };

  useEffect(() => {
    if (!open) {
      closingRef.current = false;
      pendingSelectionRef.current = null;
      setClosing(false);
      return;
    }

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
      }
      if (event.key === 'Tab') {
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
  }, [open, requestClose]);

  if (!open) return null;

  const contentState = closing ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 };
  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="사이트 목차"
      initial={false}
      animate={closing ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={completeClose}
      className="fixed inset-0 z-[9999] flex min-h-[100dvh] flex-col overflow-y-auto bg-[#EFECE6] px-6 pb-6 pt-5 sm:px-10 sm:pb-8 sm:pt-8"
    >
      <div className="flex shrink-0 justify-end">
        <motion.button
          ref={closeButtonRef}
          type="button"
          onClick={() => requestClose()}
          aria-label="목차 닫기"
          animate={contentState}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="grid h-12 w-12 place-items-center text-espresso transition-colors hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <X size={22} strokeWidth={1.2} aria-hidden="true" />
        </motion.button>
      </div>
      <nav aria-label="주요 목차" className="my-auto flex flex-1 flex-col items-center justify-center gap-6 py-10 sm:gap-8 sm:py-12">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            type="button"
            onClick={() => requestClose(item.target)}
            initial={{ opacity: 0, y: 14 }}
            animate={contentState}
            transition={{ delay: closing || reduceMotion ? 0 : 0.04 + index * 0.045, duration: reduceMotion ? 0 : 0.24 }}
            className="text-center font-serif text-[clamp(1.25rem,2vw,1.5rem)] font-light leading-relaxed tracking-[0.18em] text-espresso transition-colors hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
          >
            {item.label}
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
}
