import { useEffect, useState } from 'react';
import ContactPage from './components/ContactPage';
import MenuOverlay from './components/MenuOverlay';
import ProjectEditorModal from './components/ProjectEditorModal';
import SiteHeader from './components/SiteHeader';
import WorkDetailPage from './components/WorkDetailPage';
import WorksPage from './components/WorksPage';
import { isWorkSection, type ArchiveProject, type MenuTarget, type VisualArchiveProject, type WorkSection } from './data/archive';
import { useArchiveProjects } from './hooks/useArchiveProjects';

type RouteState =
  | { view: 'works' }
  | { view: 'contact' }
  | { view: 'detail'; projectId: string };

type EditorState = {
  section: WorkSection;
  project?: ArchiveProject;
};

function withCurrentSearch(path: string) {
  return `${path}${window.location.search}`;
}

function readRoute(): RouteState {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/contact') return { view: 'contact' };
  const detailMatch = path.match(/^\/works\/([^/]+)$/);
  if (detailMatch) {
    let projectId = detailMatch[1];
    try {
      projectId = decodeURIComponent(projectId);
    } catch {
      // Keep the raw ID so the detail view can show its not-found state.
    }
    return { view: 'detail', projectId };
  }
  return { view: 'works' };
}

function makeHistoryState(view: 'works' | 'contact' | 'detail', section?: WorkSection, fromGallery = false) {
  return {
    youngminView: view,
    ...(section ? { youngminSection: section } : {}),
    ...(fromGallery ? { youngminFromGallery: true } : {}),
  };
}

function findVisualProject(projects: ArchiveProject[], projectId: string): VisualArchiveProject | undefined {
  return projects.find((project): project is VisualArchiveProject => project.id === projectId && project.kind === 'visual');
}

export default function App() {
  const { projects, addProject, updateProject, deleteProject, storageNotice } = useArchiveProjects();
  const [route, setRoute] = useState<RouteState>(readRoute);
  const [activeSection, setActiveSection] = useState<WorkSection>(() => {
    const initialRoute = readRoute();
    const savedSection = window.history.state?.youngminSection;
    if (initialRoute.view === 'detail') {
      const project = projects.find((item) => item.id === initialRoute.projectId);
      if (project) return project.section;
    }
    return isWorkSection(savedSection) ? savedSection : 'SNAP';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [editor, setEditor] = useState<EditorState | null>(null);

  useEffect(() => {
    const syncLocation = () => {
      const nextRoute = readRoute();
      if (nextRoute.view === 'detail') {
        const project = projects.find((item) => item.id === nextRoute.projectId);
        if (project) setActiveSection(project.section);
      } else if (nextRoute.view === 'works') {
        const savedSection = window.history.state?.youngminSection;
        if (isWorkSection(savedSection)) setActiveSection(savedSection);
      }
      setRoute(nextRoute);
      setMenuOpen(false);
      setEditor(null);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', syncLocation);
    return () => window.removeEventListener('popstate', syncLocation);
  }, [projects]);

  useEffect(() => {
    if (route.view === 'contact') {
      document.title = 'CONTACT — YOUNGMIN GALLERY';
    } else if (route.view === 'detail') {
      const project = projects.find((item) => item.id === route.projectId);
      document.title = `${project?.title || 'WORK DETAIL'} — YOUNGMIN GALLERY`;
    } else {
      document.title = 'GALLERY — YOUNGMIN GALLERY';
    }
  }, [route, projects]);

  const navigate = (selection: MenuTarget | 'HOME') => {
    const nextRoute: RouteState = selection === 'CONTACT' ? { view: 'contact' } : { view: 'works' };
    const nextPath = withCurrentSearch(selection === 'CONTACT' ? '/contact' : '/');
    const nextSection = selection === 'CONTACT'
      ? undefined
      : selection === 'HOME'
        ? activeSection
        : selection;
    const state = selection === 'CONTACT'
      ? makeHistoryState('contact')
      : makeHistoryState('works', nextSection);
    const currentPath = `${window.location.pathname}${window.location.search}`;
    if (currentPath !== nextPath) {
      window.history.pushState(state, '', nextPath);
    } else {
      window.history.replaceState(state, '', nextPath);
    }
    if (nextSection) setActiveSection(nextSection);
    setRoute(nextRoute);
    setMenuOpen(false);
    setEditor(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProject = (projectId: string) => {
    const project = findVisualProject(projects, projectId);
    if (!project) return;
    const nextPath = withCurrentSearch(`/works/${encodeURIComponent(projectId)}`);
    if (window.location.pathname === '/') {
      window.history.replaceState(makeHistoryState('works', project.section), '', withCurrentSearch('/'));
    }
    const currentPath = `${window.location.pathname}${window.location.search}`;
    if (currentPath !== nextPath) {
      window.history.pushState(makeHistoryState('detail', project.section, true), '', nextPath);
    }
    setActiveSection(project.section);
    setRoute({ view: 'detail', projectId });
    setMenuOpen(false);
    setEditor(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const backToGallery = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    const section = project?.section ?? activeSection;
    if (window.history.state?.youngminFromGallery === true) {
      window.history.back();
      return;
    }
    window.history.replaceState(makeHistoryState('works', section), '', withCurrentSearch('/'));
    setActiveSection(section);
    setRoute({ view: 'works' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveProject = (project: ArchiveProject): boolean => {
    const saved = editor?.project ? updateProject(project) : addProject(project);
    if (!saved) return false;
    setEditor(null);
    return true;
  };

  const confirmDelete = (project: ArchiveProject) => {
    const label = project.title || (project.kind === 'film' ? project.category : project.id);
    if (window.confirm(`Delete “${label}” from this browser's archive? This cannot be undone.`)) {
      deleteProject(project.id);
    }
  };

  return (
    <div className="min-h-screen bg-sand text-espresso">
      <SiteHeader
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
        onHome={() => navigate('HOME')}
      />
      {route.view === 'contact' ? (
        <ContactPage />
      ) : route.view === 'detail' ? (
        <WorkDetailPage
          project={findVisualProject(projects, route.projectId)}
          onBack={() => backToGallery(route.projectId)}
        />
      ) : (
        <WorksPage
          activeSection={activeSection}
          projects={projects}
          storageNotice={storageNotice}
          onSectionChange={setActiveSection}
          onContact={() => navigate('CONTACT')}
          onOpenProject={openProject}
          onAddProject={(section) => setEditor({ section })}
          onEditProject={(project) => setEditor({ section: project.section, project })}
          onDeleteProject={confirmDelete}
        />
      )}
      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={(selection) => navigate(selection)}
      />
      {editor && (
        <ProjectEditorModal
          key={`${editor.project?.id ?? `new-${editor.section}`}`}
          section={editor.section}
          project={editor.project}
          onCancel={() => setEditor(null)}
          onSave={saveProject}
        />
      )}
    </div>
  );
}
