import { useCallback, useState } from 'react';
import {
  defaultArchiveProjects,
  workSections,
  type ArchiveImage,
  type ArchiveProject,
  type FilmProject,
  type VisualArchiveProject,
  type VisualWorkSection,
} from '../data/archive';

export const LOCAL_ARCHIVE_STORAGE_KEY = 'youngmin-gallery-projects:v1';
export const MAX_LOCAL_ARCHIVE_BYTES = 4 * 1024 * 1024;
const MAX_DATA_URL_CHARACTERS = 700_000;
const SAFE_IMAGE_DATA_URL = /^data:image\/(?:webp|jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$/i;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSafeImageSource(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) return false;
  if (value.startsWith('/manus-storage/')) return true;
  if (value.startsWith('data:')) {
    return value.length <= MAX_DATA_URL_CHARACTERS
      && !/\s/.test(value)
      && SAFE_IMAGE_DATA_URL.test(value);
  }
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isArchiveImage(value: unknown): value is ArchiveImage {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.alt === 'string'
    && typeof value.caption === 'string'
    && typeof value.credit === 'string'
    && isSafeImageSource(value.src);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isArchiveProject(value: unknown): value is ArchiveProject {
  if (!isRecord(value)
    || typeof value.id !== 'string'
    || !/^[a-z0-9][a-z0-9-]*$/.test(value.id)
    || typeof value.title !== 'string'
    || typeof value.section !== 'string'
    || !(workSections as readonly string[]).includes(value.section)) {
    return false;
  }

  if (value.kind === 'visual') {
    return value.section !== 'FILM & DRAMA'
      && Boolean(value.title.trim())
      && (value.coverRatio === 'portrait' || value.coverRatio === 'landscape')
      && isArchiveImage(value.cover)
      && Array.isArray(value.images)
      && value.images.length > 0
      && value.images.every(isArchiveImage)
      && (value.projectNote === undefined || isNullableString(value.projectNote));
  }

  if (value.kind === 'film') {
    return value.section === 'FILM & DRAMA'
      && typeof value.category === 'string'
      && value.category.trim().length > 0
      && isNullableString(value.roleCredits)
      && isNullableString(value.synopsis)
      && isNullableString(value.productionYear)
      && isNullableString(value.runtime)
      && isNullableString(value.youtubeVideoId)
      && isNullableString(value.videoSrc)
      && isArchiveImage(value.image);
  }

  return false;
}

function loadProjects(): ArchiveProject[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_ARCHIVE_STORAGE_KEY);
    if (!raw) return defaultArchiveProjects;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.projects)) {
      return defaultArchiveProjects;
    }

    const projects = parsed.projects;
    if (!projects.every(isArchiveProject)) return defaultArchiveProjects;
    const ids = projects.map((project) => (project as ArchiveProject).id);
    if (new Set(ids).size !== ids.length) return defaultArchiveProjects;
    return projects as ArchiveProject[];
  } catch {
    return defaultArchiveProjects;
  }
}

function estimateStorageBytes(projects: ArchiveProject[]): number {
  const serialized = JSON.stringify({ version: 1, projects });
  // Web Storage implementations account for UTF-16 code units; leave headroom below common quotas.
  return serialized.length * 2;
}

export function createArchiveProjectId(): string {
  const randomPart = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `project-${randomPart.toLowerCase()}`;
}

export function useArchiveProjects() {
  const [projects, setProjects] = useState<ArchiveProject[]>(loadProjects);
  const [storageNotice, setStorageNotice] = useState<string | null>(null);

  const persistProjects = useCallback((nextProjects: ArchiveProject[]): boolean => {
    try {
      if (estimateStorageBytes(nextProjects) > MAX_LOCAL_ARCHIVE_BYTES) {
        setStorageNotice('This browser archive has reached its 4 MiB photo-storage limit. Remove photos or choose smaller files before saving.');
        return false;
      }
      window.localStorage.setItem(LOCAL_ARCHIVE_STORAGE_KEY, JSON.stringify({ version: 1, projects: nextProjects }));
      setStorageNotice(null);
      return true;
    } catch {
      setStorageNotice('Browser storage is full or unavailable. Remove some photos or choose smaller files, then try again.');
      return false;
    }
  }, []);

  const addProject = useCallback((project: ArchiveProject): boolean => {
    const nextProjects = [...projects, project];
    if (!persistProjects(nextProjects)) return false;
    setProjects(nextProjects);
    return true;
  }, [persistProjects, projects]);

  const updateProject = useCallback((updated: ArchiveProject): boolean => {
    const nextProjects = projects.map((project) => project.id === updated.id ? updated : project);
    if (!persistProjects(nextProjects)) return false;
    setProjects(nextProjects);
    return true;
  }, [persistProjects, projects]);

  const deleteProject = useCallback((projectId: string): boolean => {
    const nextProjects = projects.filter((project) => project.id !== projectId);
    if (!persistProjects(nextProjects)) return false;
    setProjects(nextProjects);
    return true;
  }, [persistProjects, projects]);

  return { projects, addProject, updateProject, deleteProject, storageNotice };
}

export function isVisualSection(section: string): section is VisualWorkSection {
  return section === 'SNAP' || section === 'PROFILE' || section === 'SET STILLS';
}

export function isVisualProject(project: ArchiveProject): project is VisualArchiveProject {
  return project.kind === 'visual';
}

export function isFilmProject(project: ArchiveProject): project is FilmProject {
  return project.kind === 'film';
}
