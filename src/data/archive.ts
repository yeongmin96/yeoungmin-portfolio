export const logoSrc = '/manus-storage/ym_logo_transparent_fcc36d3d.png';

export const workSections = ['SNAP', 'PROFILE', 'FILM & DRAMA', 'SET STILLS'] as const;
export type WorkSection = (typeof workSections)[number];
export type VisualWorkSection = Extract<WorkSection, 'SNAP' | 'PROFILE' | 'SET STILLS'>;
export type MenuTarget = WorkSection | 'CONTACT';

export const menuItems: { label: MenuTarget; target: MenuTarget }[] = [
  { label: 'SNAP', target: 'SNAP' },
  { label: 'PROFILE', target: 'PROFILE' },
  { label: 'FILM & DRAMA', target: 'FILM & DRAMA' },
  { label: 'SET STILLS', target: 'SET STILLS' },
  { label: 'CONTACT', target: 'CONTACT' },
];

export type ArchiveImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  credit: string;
};

export type VisualArchiveProject = {
  kind: 'visual';
  id: string;
  section: VisualWorkSection;
  title: string;
  cover: ArchiveImage;
  images: ArchiveImage[];
  coverRatio: 'portrait' | 'landscape';
  projectNote?: string | null;
};

export type FilmProject = {
  kind: 'film';
  id: string;
  section: 'FILM & DRAMA';
  category: string;
  title: string;
  roleCredits: string | null;
  synopsis: string | null;
  productionYear: string | null;
  runtime: string | null;
  youtubeVideoId: string | null;
  videoSrc: string | null;
  image: ArchiveImage;
};

export type ArchiveProject = VisualArchiveProject | FilmProject;

export const snapImages: ArchiveImage[] = [
  {
    id: 'portrait-39542902',
    src: '/manus-storage/portrait_39542902_a0ca056c.webp',
    alt: '따뜻한 황금빛 자연광 아래 야외에서 촬영한 여성 인물 사진. 임시 스톡 예시 이미지.',
    caption: 'Outdoor portrait · 01',
    credit: 'Pexels · Satyam Pixels · DEMO IMAGE',
  },
  {
    id: 'portrait-39542895',
    src: '/manus-storage/portrait_39542895_f5618529.webp',
    alt: '햇살을 받은 야외 여성 인물 사진. 임시 스톡 예시 이미지.',
    caption: 'Outdoor portrait · 02',
    credit: 'Pexels · Satyam Pixels · DEMO IMAGE',
  },
  {
    id: 'couple-28459356',
    src: '/manus-storage/couple_28459356_b9f6fa05.webp',
    alt: '황금빛 시간대의 야외에서 춤추는 커플. Youngmin의 실제 작품이 아닌 스톡 데모 이미지.',
    caption: 'Outdoor couple · 03',
    credit: 'Pexels · Huy Nguyễn · DEMO IMAGE',
  },
];

export const profileImages: ArchiveImage[] = [
  snapImages[1],
  {
    id: 'profile-33301115',
    src: '/manus-storage/profile_33301115_7d92036d.webp',
    alt: '따뜻한 햇살이 드는 풀밭을 걷는 남성 프로필. Youngmin의 실제 작품이 아닌 스톡 데모 이미지.',
    caption: 'Portrait study · 02',
    credit: 'Pexels · Mohammad Kashkooli · DEMO IMAGE',
  },
];

export const snapProjects: VisualArchiveProject[] = [
  {
    kind: 'visual',
    id: 'snap-outdoor-01',
    section: 'SNAP',
    title: 'SNAP — 01',
    cover: snapImages[0],
    images: [snapImages[0], snapImages[1]],
    coverRatio: 'portrait',
  },
  {
    kind: 'visual',
    id: 'snap-couple-01',
    section: 'SNAP',
    title: 'SNAP — 02',
    cover: snapImages[2],
    images: [snapImages[2]],
    coverRatio: 'portrait',
  },
];

export const profileProjects: VisualArchiveProject[] = [
  {
    kind: 'visual',
    id: 'profile-portrait-01',
    section: 'PROFILE',
    title: 'PROFILE — 01',
    cover: profileImages[0],
    images: [profileImages[0]],
    coverRatio: 'portrait',
  },
  {
    kind: 'visual',
    id: 'profile-portrait-02',
    section: 'PROFILE',
    title: 'PROFILE — 02',
    cover: profileImages[1],
    images: [profileImages[1]],
    coverRatio: 'portrait',
  },
];

const filmPlaceholderImage: ArchiveImage = {
  id: 'film-5642755',
  src: '/manus-storage/film_5642755_c855da83.webp',
  alt: '촬영 장비가 있는 영상 제작 현장. Youngmin의 실제 작품이 아닌 임시 스톡 예시 이미지.',
  caption: 'Film production · DEMO IMAGE',
  credit: 'Pexels · Kyle Loftus · DEMO IMAGE',
};

export const filmProjects: FilmProject[] = [
  {
    kind: 'film',
    id: 'film-demo-01',
    section: 'FILM & DRAMA',
    category: '대학교 단편영화',
    title: '',
    roleCredits: null,
    synopsis: null,
    productionYear: null,
    runtime: null,
    youtubeVideoId: null,
    videoSrc: null,
    image: filmPlaceholderImage,
  },
  {
    kind: 'film',
    id: 'film-demo-02',
    section: 'FILM & DRAMA',
    category: '웹드라마',
    title: '',
    roleCredits: null,
    synopsis: null,
    productionYear: null,
    runtime: null,
    youtubeVideoId: null,
    videoSrc: null,
    image: {
      id: 'film-5642756',
      src: '/manus-storage/film_5642756_d62e3246.webp',
      alt: '푸른 조명 아래에서 촬영 중인 인물과 카메라의 영화 현장 이미지. 임시 스톡 예시.',
      caption: 'Motion picture · DEMO IMAGE',
      credit: 'Pexels stock · DEMO IMAGE',
    },
  },
];

export const setStillImages: ArchiveImage[] = [
  {
    id: 'set-38630356',
    src: '/manus-storage/film_38630356_82ecb5b2.webp',
    alt: '극적인 조명 아래 흑백으로 촬영한 영화 촬영 현장 비하인드. 임시 스톡 예시 이미지.',
    caption: 'Behind the scenes · 01',
    credit: 'Pexels · Jan Sommer · DEMO IMAGE',
  },
  {
    id: 'set-5488369',
    src: '/manus-storage/set_5488369_1b9a9643.webp',
    alt: '실내 세트에서 카메라를 운용하는 영상 제작 현장. 임시 스톡 예시 이미지.',
    caption: 'Set still · 02',
    credit: 'Pexels stock · DEMO IMAGE',
  },
  {
    id: 'set-5563240',
    src: '/manus-storage/set_5563240_2fd51e96.webp',
    alt: '카메라와 조명 장비를 사용 중인 촬영 현장 스톡 사진. 임시 예시 이미지.',
    caption: 'On set · 03',
    credit: 'Pexels stock · DEMO IMAGE',
  },
];

export const setStillProjects: VisualArchiveProject[] = [
  {
    kind: 'visual',
    id: 'set-stills-01',
    section: 'SET STILLS',
    title: 'SET STILLS — 01',
    cover: setStillImages[0],
    images: setStillImages,
    coverRatio: 'landscape',
  },
];

export const defaultArchiveProjects: ArchiveProject[] = [
  ...snapProjects,
  ...profileProjects,
  ...filmProjects,
  ...setStillProjects,
];

export const archiveProjects = defaultArchiveProjects;

export const findArchiveProject = (id: string): ArchiveProject | undefined =>
  defaultArchiveProjects.find((project) => project.id === id);

export const isWorkSection = (value: unknown): value is WorkSection =>
  typeof value === 'string' && (workSections as readonly string[]).includes(value);

// The owner provided this public email; Instagram details are intentionally hidden for now.
export const contactInfo = {
  instagramUrl: '',
  instagramLabel: 'Instagram URL not provided',
  emailAddress: 'mic906@naver.com',
  emailLabel: 'Email address not provided',
} as const;
