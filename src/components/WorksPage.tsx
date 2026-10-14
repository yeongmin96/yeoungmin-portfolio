import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Pencil, Play, Plus, Trash2 } from 'lucide-react';
import {
  defaultArchiveProjects,
  workSections,
  type ArchiveProject,
  type FilmProject,
  type VisualArchiveProject,
  type WorkSection,
} from '../data/archive';

type WorksPageProps = {
  activeSection: WorkSection;
  projects: ArchiveProject[];
  storageNotice: string | null;
  onSectionChange: (section: WorkSection) => void;
  onContact: () => void;
  onOpenProject: (projectId: string) => void;
  onAddProject: (section: WorkSection) => void;
  onEditProject: (project: ArchiveProject) => void;
  onDeleteProject: (project: ArchiveProject) => void;
};

function ProjectEditorActions({ project, onEdit, onDelete }: {
  project: ArchiveProject;
  onEdit: (project: ArchiveProject) => void;
  onDelete: (project: ArchiveProject) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 text-[9px] uppercase tracking-[0.12em] text-espresso/55">
      <button type="button" onClick={() => onEdit(project)} aria-label={`Edit ${project.title || project.id}`} className="inline-flex min-h-10 items-center gap-1.5 transition-colors hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta">
        <Pencil size={13} strokeWidth={1.4} aria-hidden="true" /> Edit
      </button>
      <button type="button" onClick={() => onDelete(project)} aria-label={`Delete ${project.title || project.id}`} className="inline-flex min-h-10 items-center gap-1.5 transition-colors hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-800">
        <Trash2 size={13} strokeWidth={1.4} aria-hidden="true" /> Delete
      </button>
    </div>
  );
}

function ProjectCover({ project, index, onOpen, onEdit, onDelete, reduceMotion, canEdit }: {
  project: VisualArchiveProject;
  index: number;
  onOpen: (projectId: string) => void;
  onEdit: (project: ArchiveProject) => void;
  onDelete: (project: ArchiveProject) => void;
  reduceMotion: boolean;
  canEdit: boolean;
}) {
  const aspectClass = project.coverRatio === 'portrait' ? 'aspect-[4/5]' : 'aspect-[16/10]';
  return (
    <motion.article
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : index * 0.07 }}
      className="group"
    >
      <button
        type="button"
        onClick={() => onOpen(project.id)}
        aria-label={`${project.title} 프로젝트 상세 보기`}
        className={`block w-full overflow-hidden bg-[#D7D2C8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta ${aspectClass}`}
      >
        <img
          src={project.cover.src}
          alt={project.cover.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
        />
      </button>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 sm:mt-4">
        <h3 className="font-serif text-xl text-espresso sm:text-2xl">{project.title}</h3>
        {canEdit && <ProjectEditorActions project={project} onEdit={onEdit} onDelete={onDelete} />}
      </div>
    </motion.article>
  );
}

function VideoPlayer({ project }: { project: FilmProject }) {
  if (project.youtubeVideoId) {
    return (
      <div className="group relative aspect-video w-full overflow-hidden bg-[#D7D2C8]">
        <img src={project.image.src} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-[#23201D]/30 transition-colors group-hover:bg-[#23201D]/40" />
        <a
          href={`https://www.youtube.com/watch?v=${encodeURIComponent(project.youtubeVideoId)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Play ${project.title || project.category} on YouTube in a new tab`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#EFECE6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#EFECE6]"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full border border-[#EFECE6]/80 bg-[#EFECE6]/10 transition-colors group-hover:bg-[#EFECE6]/20 sm:h-16 sm:w-16">
            <Play size={21} strokeWidth={1.2} aria-hidden="true" />
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] sm:text-[10px]">Play on YouTube</span>
        </a>
      </div>
    );
  }

  if (project.videoSrc) {
    return (
      <video controls playsInline preload="metadata" poster={project.image.src} aria-label={project.title || project.category} className="aspect-video w-full bg-espresso object-contain">
        <source src={project.videoSrc} />
        동영상을 재생하려면 브라우저를 업데이트해 주세요.
      </video>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-[#D7D2C8]" role="img" aria-label={`${project.category} 영상 링크 입력 예정`}>
      <img src={project.image.src} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#23201D]/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center text-[#EFECE6]">
        <Play size={21} strokeWidth={1.2} aria-hidden="true" />
        <span className="text-[9px] uppercase tracking-[0.2em] sm:text-[10px]">Video link not provided</span>
        <span className="text-[10px] text-[#EFECE6]/80">YouTube URL 입력 후 재생됩니다.</span>
      </div>
    </div>
  );
}

function FilmInformation({ project }: { project: FilmProject }) {
  const fields = [
    ['Title', project.title || '작품명 입력 예정'],
    ['Role / Credits', project.roleCredits ?? '참여 직책·크레딧 입력 예정'],
    ['Synopsis', project.synopsis ?? '시놉시스 및 기획 의도 입력 예정'],
    ['Production Year', project.productionYear ?? '제작 연도 입력 예정'],
    ['Runtime', project.runtime ?? '러닝타임 입력 예정'],
  ];

  return (
    <dl className="mt-4 divide-y divide-espresso/15 border-y border-espresso/20">
      {fields.map(([label, value]) => (
        <div key={label} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[minmax(130px,0.72fr)_2fr] sm:gap-5">
          <dt className="text-[9px] uppercase tracking-[0.16em] text-espresso/50">{label}</dt>
          <dd className="text-xs leading-relaxed text-espresso/80 sm:text-sm">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function AddProjectButton({ section, onClick }: { section: WorkSection; onClick: (section: WorkSection) => void }) {
  return (
    <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-espresso/20 pt-4 sm:mt-12 sm:flex-row sm:items-center">
      <button type="button" onClick={() => onClick(section)} className="inline-flex min-h-11 items-center gap-2 border border-espresso/35 px-4 text-[10px] uppercase tracking-[0.15em] text-espresso transition-colors hover:border-terracotta hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta">
        <Plus size={14} strokeWidth={1.5} aria-hidden="true" /> Add Project
      </button>
      <span className="text-[9px] uppercase tracking-[0.12em] text-espresso/45">Saved in this browser only</span>
    </div>
  );
}

function ProjectListActions({ section, onAddProject }: { section: WorkSection; onAddProject: (section: WorkSection) => void }) {
  return <AddProjectButton section={section} onClick={onAddProject} />;
}

export default function WorksPage({
  activeSection,
  projects = defaultArchiveProjects,
  storageNotice,
  onSectionChange,
  onContact,
  onOpenProject,
  onAddProject,
  onEditProject,
  onDeleteProject,
}: WorksPageProps) {
  const reduceMotion = useReducedMotion();
  const canEdit = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('edit') === '1';
  const visibleProjects = projects.filter((project) => project.section === activeSection);

  return (
    <main className="mx-auto max-w-[1680px] px-5 pb-16 sm:px-9 sm:pb-24 lg:px-14">
      <header className="flex min-h-[390px] flex-col items-center justify-center border-b border-espresso/20 py-20 text-center sm:min-h-[470px] sm:py-28 lg:min-h-[560px]">
        <p className="mb-5 text-center text-[9px] uppercase tracking-[0.27em] text-espresso/55 sm:mb-7 sm:text-[10px]">
          PHOTOGRAPHER &amp; FILMMAKER · WORKS ARCHIVE
        </p>
        <h1 className="text-center font-serif text-[clamp(4rem,13vw,11rem)] font-light leading-[0.88] tracking-[-0.055em] text-espresso">
          GALLERY
        </h1>
        <p className="mt-8 max-w-[44rem] text-center font-serif text-lg italic leading-relaxed text-espresso/75 sm:mt-10 sm:text-2xl">
          Capturing Fleeting Moments into Lasting Memories
        </p>
        <p className="mt-3 text-center text-[9px] uppercase tracking-[0.2em] text-espresso/50 sm:mt-4 sm:text-[10px]">
          PHOTOGRAPHY &amp; FILM BY YOUNGMIN
        </p>
      </header>

      <section aria-labelledby="works-heading" className="pt-12 sm:pt-16 lg:pt-20">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="mb-2 text-[9px] uppercase tracking-[0.24em] text-espresso/50">01 — 04 / INDEX</p>
            <h2 id="works-heading" className="font-serif text-3xl font-normal tracking-tight sm:text-4xl">Project Index</h2>
          </div>
          <span className="pb-1 text-right text-[9px] uppercase tracking-[0.17em] text-espresso/45">Choose a category</span>
        </div>

        <div role="tablist" aria-label="작품 분류" className="mb-9 flex gap-5 overflow-x-auto border-b border-espresso/20 sm:mb-12 sm:gap-9">
          {workSections.map((section, index) => (
            <button
              key={section}
              id={`tab-${index}`}
              type="button"
              role="tab"
              aria-selected={activeSection === section}
              aria-controls="archive-panel"
              onClick={() => onSectionChange(section)}
              className={`shrink-0 border-b pb-3 text-[10px] uppercase tracking-[0.16em] transition-colors sm:text-xs ${activeSection === section ? 'border-terracotta text-espresso' : 'border-transparent text-espresso/45 hover:text-espresso'}`}
            >
              <span className="mr-2 font-sans text-[9px] text-terracotta/80">0{index + 1}</span>{section}
            </button>
          ))}
        </div>

        {canEdit && storageNotice && <p role="status" className="mb-6 border border-terracotta/30 px-4 py-3 text-xs text-espresso/70">{storageNotice}</p>}

        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={activeSection}
            id="archive-panel"
            role="tabpanel"
            aria-labelledby={`tab-${workSections.indexOf(activeSection)}`}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
          >
            {activeSection === 'FILM & DRAMA' ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-2 lg:gap-y-16">
                {visibleProjects.filter((project): project is FilmProject => project.kind === 'film').map((project, index) => (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.08 }}
                  >
                    <VideoPlayer project={project} />
                    <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-espresso/20 pb-3">
                      <p className="text-[9px] uppercase tracking-[0.17em] text-espresso/50">FILM &amp; DRAMA · 0{index + 1}</p>
                      <span className="font-serif text-lg text-espresso sm:text-xl">{project.title || project.category}</span>
                    </div>
                    <FilmInformation project={project} />
                    <div className="mt-2 flex justify-end">
                      {canEdit && <ProjectEditorActions project={project} onEdit={onEditProject} onDelete={onDeleteProject} />}
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-9">
                {visibleProjects.filter((project): project is VisualArchiveProject => project.kind === 'visual').map((project, index) => (
                  <ProjectCover
                    key={project.id}
                    project={project}
                    index={index}
                    onOpen={onOpenProject}
                    onEdit={onEditProject}
                    onDelete={onDeleteProject}
                    reduceMotion={Boolean(reduceMotion)}
                    canEdit={canEdit}
                  />
                ))}
              </div>
            )}

            {visibleProjects.length === 0 && (
              <p className="py-12 text-center font-serif text-xl italic text-espresso/55">No projects in this category yet.</p>
            )}
            {canEdit && <ProjectListActions section={activeSection} onAddProject={onAddProject} />}
          </motion.section>
        </AnimatePresence>

      </section>

      <footer className="mt-16 flex flex-col items-start justify-between gap-5 border-t border-espresso/20 pt-5 sm:mt-20 sm:flex-row sm:items-center">
        <p className="text-[9px] uppercase tracking-[0.17em] text-espresso/50">Youngmin · Photographer &amp; Filmmaker</p>
        <button type="button" onClick={onContact} className="font-serif text-xl italic transition-colors hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta">Contact ↗</button>
      </footer>
    </main>
  );
}
