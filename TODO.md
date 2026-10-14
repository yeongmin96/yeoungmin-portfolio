# TODO — Youngmin Gallery 읽기 전용 공개 아카이브

## 1. 갤러리와 기존 아카이브
- [x] 메인 화면 상단 서브텍스트는 `PHOTOGRAPHER & FILMMAKER · WORKS ARCHIVE`다.
- [x] 중앙 메인 타이틀은 세리프 `GALLERY` 단독 표기이며 `YOUNGMIN`은 제거한다.
- [x] 큰 이탤릭 서브카피는 `Capturing Fleeting Moments into Lasting Memories`, 작은 서브카피는 `PHOTOGRAPHY & FILM BY YOUNGMIN`이며, `SEOUL · SELECTED ARCHIVE` 라인은 없다.
- [x] 메뉴/갤러리 분류를 `01 SNAP`, `02 PROFILE`, `03 FILM & DRAMA`, `04 SET STILLS`, `05 CONTACT`로 구성한다. 스냅과 프로필은 독립 갤러리 탭이다.
- [x] 메뉴 오버레이는 솔리드 `#EFECE6`이며 20–24px 다섯 목차, 충분한 여백과 우측 상단 X를 제공한다.
- [x] Calm Sand & Oatmeal 배경 `#EFECE6`, 에스프레소 텍스트 `#23201D`, 상단 YM 투명 로고를 유지한다.
- [x] SNAP/PROFILE 및 SET STILLS 커버에서 `/works/:projectId` 상세로 이동하고 Lightbox 및 갤러리 복귀를 제공한다.
- [x] Contact 페이지를 유지하고 상업용 요금/예약 상품은 추가하지 않는다. 갤러리 하단 Pexels 안내 블록은 삭제한다.

## 2. 프로젝트 사진 파일 첨부 및 브라우저 저장
- [x] `Add Project`와 `Edit Project`의 메인 커버 및 상세 사진 입력에서 이미지 URL 텍스트 입력을 제거하고 `<input type="file">` 파일 첨부를 제공한다.
- [x] SNAP / PROFILE / SET STILLS의 `메인 커버 사진 첨부`는 이미지 파일 1장을 선택하고 미리보기 썸네일을 보여준다.
- [x] `상세 사진들 첨부`는 `multiple` 파일 선택으로 여러 사진을 한 번에 등록하며 미리보기와 개별 제거를 제공한다.
- [x] 선택 이미지를 비율을 유지해 브라우저에서 압축하고 Data URL/Base64로 안전하게 `localStorage`에 저장하며 저장 성공 직후 UI에 반영한다. 네트워크로 업로드하지 않는다.
- [x] `Edit Project`에서 기존 커버/상세 사진을 보존하고, 새 커버/상세 사진으로 교체·추가·제거할 수 있다.
- [x] FILM & DRAMA 추가/수정 폼은 `커스텀 썸네일 이미지 파일 첨부`와 미리보기를 제공한다.
- [x] 이미지 형식/크기 및 localStorage 저장 예산을 검증한다. 저장 실패 시 편집 모달을 닫거나 현재 프로젝트를 덮어쓰지 않고 명확한 오류를 보여준다.

## 3. 사진 상세 페이지와 영상 동작
- [x] 사진 프로젝트 상세에서 이미지별 캡션/크레딧/설명과 사진 위 샘플 워터마크를 제거한다. 상단의 프로젝트명/뒤로가기와 여백을 둔 큰 세로 사진 롤은 유지한다.
- [x] visual 프로젝트에 `Project Note`를 입력할 수 있으며 상세 사진을 모두 지난 맨 아래에만 작가 코멘트/짧은 설명을 한 번 표시한다.
- [x] 라이트박스에서도 사진별 캡션/크레딧 텍스트를 표시하지 않는다.
- [x] FILM & DRAMA 카드 중앙 재생 버튼은 입력된 YouTube 영상 링크를 `target="_blank"` 새 탭에서 열며 내부 플레이어/iframe을 사용하지 않는다. 링크가 없으면 비활성 안내를 보인다.
- [x] FILM & DRAMA 카드 상단의 `SAMPLE IMAGE - NOT YOUNGMIN'S WORK` 등 데모 워터마크 문구를 제거한다.

## 4. 작가 카피와 저장 UI
- [x] 카테고리 상단 제목은 `Project Index`다.
- [x] 메인 서브 영역은 `Capturing Fleeting Moments into Lasting Memories`와 `PHOTOGRAPHY & FILM BY YOUNGMIN`이다.
- [x] Add/Edit 모달에는 진한 `#23201D` 배경·흰 텍스트의 `SAVE`/`SAVE PROJECT` 버튼이 있고, `CANCEL`은 은은한 아웃라인이다.
- [x] 저장 성공 시 입력/첨부 내용이 즉시 반영되고 모달이 닫힌다.

## 5. CONTACT 카피와 연락처
- [x] `CONTACT` 제목 크기는 절제된 크기로 줄이고, 서브텍스트는 이탤릭 세리프 `Feel free to reach out anytime.`다.
- [x] CONTACT의 Email 항목은 `mic906@naver.com`을 표시하고 `mailto:mic906@naver.com` 링크로 연다.
- [x] Instagram 영역과 `Instagram link · to be added` 안내 문구는 표시하지 않는다.
- [x] 메인 화면의 `SEOUL · SELECTED ARCHIVE` 메타 문구를 완전히 제거한다.

## 6. 공개 View Only와 관리 모드
- [x] 기본 공개 URL에서 `+ Add Project`, `Edit`, `Delete` 버튼과 편집용 경고를 렌더링하지 않고 카테고리/상세 감상은 계속 가능하다.
- [x] 같은 브라우저에서 `?edit=1`을 명시한 경우에만 Add/Edit/Delete 관리 버튼이 보이며 메뉴·상세·Contact 내부 이동에서도 쿼리를 보존한다.
- [x] 갤러리 하단의 전체 `ARCHIVE PREVIEW` 및 Pexels·브라우저 저장 안내 블록을 삭제한다.
- [x] `?edit=1`은 UI 표시 토글이며 인증/접근 제어가 아니다. 프로젝트 데이터는 해당 브라우저 `localStorage`에만 저장되고 다른 브라우저와 공유되지 않는다.

## 7. 품질과 저장
- [x] SNAP, PROFILE, FILM & DRAMA, SET STILLS 전 범주 Add/Edit/Delete와 브라우저 저장 유지 흐름을 검증했다.
- [x] 모바일 레이아웃, TypeScript, production build, 전체 라우트 매니페스트를 확인했다.
- [x] 최종 변경사항을 canonical `main`에 저장하고 원격 SHA를 확인한다. `auto_publish` 설정을 보존하고 별도 요청 없이는 공개 게시하지 않는다.
