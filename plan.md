# Youngmin Gallery — 읽기 전용 공개 아카이브 계획

## 목적과 범위

기존 Vite/React/TypeScript/Tailwind/Framer Motion 기반 웜 갤러리를 공개 방문자에게는 감상 전용으로 제공한다. 기본 URL에서는 Add/Edit/Delete 컨트롤을 렌더링하지 않고, 동일 브라우저에서 관리자가 `?edit=1`을 붙여 열면 로컬 편집 UI를 표시한다. 현재 데이터는 localStorage에만 있으므로 다른 브라우저와 동기화되지 않으며, `?edit=1`은 UI 표시 토글이지 인증/접근 제어가 아니다. 오트밀 배경 `#EFECE6`, 에스프레소 텍스트/선 `#23201D`, 투명 YM 로고, 5개 메뉴 및 비상업 아카이브 성격은 유지한다.

## 디자인 시스템

- **Design Movement**: 미술관 도록과 작가의 개인 아카이브가 만나는 웜 미니멀리즘.
- **Core Principles**: (1) 충분한 여백과 사진 중심의 편집. (2) 일반 방문자는 순수 감상 모드. (3) 편집 UI는 관리자가 요청한 순간에만 나타나는 절제된 폼. (4) 모바일에서도 사진과 콘텐츠가 한 열로 자연스럽게 흐른다.
- **Color Philosophy**: `#EFECE6`는 종이와 전시 벽의 온기, `#23201D`는 잉크 같은 가독성, 테라코타 `#9A6E57`는 작고 절제된 선택/hover 상태.
- **Layout Paradigm**: 중앙 `GALLERY` 타이틀 아래 이탤릭 세리프 `Capturing Fleeting Moments into Lasting Memories`, 작은 `PHOTOGRAPHY & FILM BY YOUNGMIN`을 둔다. `Project Index`부터 카테고리별 커버 인덱스를 전시한다. 상세는 사진만 세로로 이어지는 롤이며 노트는 맨 끝에 한 번만 둔다. CONTACT 제목은 단정한 크기, 서브문구는 `Feel free to reach out anytime.`의 이탤릭 세리프다. CONTACT에는 `mic906@naver.com` mailto 링크만 표시하고 Instagram 영역은 숨긴다.
- **Signature Elements**: YM 투명 워드마크, 가느다란 에스프레소 구분선, serif 제목과 넓은 자간의 UI.
- **Interaction Philosophy**: 기본 URL은 View Only로서 작품 카드와 카테고리 탐색만 허용한다. `?edit=1`이 명시된 동일 브라우저 세션에서는 Add/Edit/Delete와 localStorage 경고를 보여준다. 이는 인증 장치가 아니며, 서버/계정/공유 DB를 추가하지 않는다. 공개 화면의 하단 Pexels 안내 블록은 제거한다.
- **Animation**: 모달/페이지 전환은 차분하고 짧게, 사진 호버는 미세하게, `prefers-reduced-motion`을 따른다.
- **Typography System**: Cormorant Garamond 계열 serif로 GALLERY/프로젝트 제목, DM Sans 및 Noto Sans KR로 UI/한국어를 조판한다.
- **Brand Essence**: 영민의 스냅·인물·영상 기록을 담는, 절제되고 따뜻하며 관찰적인 아티스트 아카이브.
- **Brand Voice**: 제목은 짧고 편집적으로, 동작·저장 안내는 직접적이다. 예: `Capturing Fleeting Moments into Lasting Memories` / `PHOTOGRAPHY & FILM BY YOUNGMIN` / `Feel free to reach out anytime.`.
- **Wordmark & Logo**: 사용자가 제공한 YM 투명 PNG를 헤더에 그대로 사용한다.
- **Signature Brand Color**: 웜 샌드와 조화를 이루는 테라코타 `#9A6E57`.

## 콘텐츠와 데이터 흐름

`src/data/archive.ts`는 SNAP, PROFILE, FILM & DRAMA, SET STILLS의 공용 타입과 `mic906@naver.com` 연락처를 정의한다. visual 프로젝트는 커버, 상세 이미지, 선택적 프로젝트 노트를 갖고, film 프로젝트의 image는 커스텀 썸네일로 재사용한다. 기본 공개 갤러리 카드 클릭은 상세 감상으로 이어진다.

`ProjectEditorModal`은 파일 첨부/미리보기/노트 입력, sticky SAVE/CANCEL 푸터를 제공하고 `?edit=1` 모드에서만 열린다. `useArchiveProjects`는 localStorage 저장 예산과 이미지 입력을 검증한다. 이 브라우저 저장 방식은 다른 사람/브라우저와 프로젝트 데이터를 공유하지 않는다.

`WorksPage`는 URL의 `edit=1` 값이 있을 때에만 Add Project, Edit, Delete, 저장 경고를 렌더링한다. 그렇지 않으면 버튼 없는 읽기 전용 갤러리다. 내부 링크는 현재 쿼리를 보존해 관리 모드의 카테고리/상세/Contact 탐색이 이어지게 한다. Pexels 출처/샘플 안내 텍스트 블록은 삭제하며, 이미지 자체의 alt/data 메타는 유지한다.

## 프로젝트 구조와 serving

- `src/App.tsx`: 페이지/history와 프로젝트 CRUD, 내부 이동 중 관리 query 보존.
- `src/data/archive.ts`: 분류·작품 타입, 기본 프로젝트와 작가가 제공한 이메일 정보.
- `src/hooks/useArchiveProjects.ts`: localStorage 읽기/검증/예산 사전 검사/쓰기 및 CRUD.
- `src/components/WorksPage.tsx`: GALLERY, Project Index, 카테고리, 기본 읽기 전용 및 query 기반 관리 버튼, YouTube 링크.
- `src/components/ProjectEditorModal.tsx`: 범주별 편집 폼과 sticky SAVE/CANCEL 푸터.
- `src/components/ContactPage.tsx`: CONTACT 폼과 `mailto:mic906@naver.com`; Instagram 안내/영역 미표시.
- `src/components/WorkDetailPage.tsx`, `Lightbox.tsx`: 설명 없는 세로 사진 롤, 맨 아래 Project Note, 확대 보기.
- `src/components/MenuOverlay.tsx`: 다섯 항목 솔리드 메뉴.
- `public/manus-routes.json`: `/`, `/contact`, `/works/:projectId`.

Vite 정적 빌드를 유지한다. 모든 사용자 첨부 및 편집 내용은 해당 브라우저의 localStorage에만 존재한다. 다른 사람에게 작품 데이터를 함께 보여주려면 향후 서버/공유 저장소가 필요하다.
