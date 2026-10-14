import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import Lightbox from './Lightbox';
import type { VisualArchiveProject } from '../data/archive';

type WorkDetailPageProps = {
  project?: VisualArchiveProject;
  onBack: () => void;
};

export default function WorkDetailPage({ project, onBack }: WorkDetailPageProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  if (!project) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-[1100px] px-5 py-16 sm:px-9 sm:py-24">
        <button type="button" onClick={onBack} className="font-serif text-base italic text-espresso underline decoration-espresso/30 underline-offset-4 hover:text-terracotta">
          ← Back to Gallery
        </button>
        <p className="mt-16 font-serif text-3xl">This archive entry could not be found.</p>
      </main>
    );
  }

  const projectNote = project.projectNote?.trim();

  return (
    <main className="mx-auto max-w-[1520px] px-5 pb-20 sm:px-9 sm:pb-28 lg:px-14">
      <header className="border-b border-espresso/20 pb-8 pt-10 text-center sm:pb-12 sm:pt-14">
        <button type="button" onClick={onBack} className="mb-8 inline-flex min-h-10 items-center justify-center font-serif text-sm italic text-espresso/75 transition-colors hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta sm:text-base">
          ← Back to Gallery
        </button>
        <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-espresso/50">{project.section}</p>
        <h1 className="font-serif text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-tight tracking-[-0.045em] text-espresso">{project.title}</h1>
      </header>

      <section aria-label={`${project.title} photo roll`} className="mx-auto max-w-[1180px] pt-10 sm:pt-14">
        {project.images.map((image, index) => (
          <motion.figure
            key={image.id}
            initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.16) }}
            className="mb-14 sm:mb-20"
          >
            <button type="button" onClick={() => setLightboxIndex(index)} aria-label={`View photo ${index + 1} of ${project.title}`} className="group relative block w-full bg-[#D7D2C8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta">
              <img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} className="mx-auto block h-auto max-h-[86vh] w-full object-contain transition-transform duration-700 group-hover:scale-[1.005] motion-reduce:transition-none" />
            </button>
          </motion.figure>
        ))}
      </section>

      {projectNote && (
        <aside aria-label="Project note" className="mx-auto mb-12 max-w-[760px] border-t border-espresso/20 pt-7 text-center sm:mb-16 sm:pt-9">
          <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-espresso/50">Project Note</p>
          <p className="whitespace-pre-line font-serif text-lg leading-relaxed text-espresso/80 sm:text-xl">{projectNote}</p>
        </aside>
      )}

      <div className="mt-2 border-t border-espresso/20 pt-6 text-center">
        <button type="button" onClick={onBack} className="font-serif text-base italic text-espresso transition-colors hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta">← Back to Gallery</button>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={project.images}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrevious={() => setLightboxIndex((index) => index === null ? null : (index - 1 + project.images.length) % project.images.length)}
            onNext={() => setLightboxIndex((index) => index === null ? null : (index + 1) % project.images.length)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
