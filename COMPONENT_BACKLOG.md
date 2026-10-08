# 컴포넌트 백로그

어드민 기획서·와이어프레임을 보고 정리한, **FDS에 아직 없는 기능**의 목록입니다. 작업하면서 체크박스를 갱신합니다.

- 출처: Figma `Om9T7GTfFHj4rske9A5BLe` (디지털자산플랫폼) 노드 97개 분석 (2026-10-08)
- 기준: **기능적인 것만** 봅니다. 색·크기·밀도·장식·순수 레이아웃은 기능 공백이 아니므로 뺐습니다.
- 노드 표기: `1045-178926` = Figma 노드 `1045:178926`
- 빈도는 에이전트별 집계를 합친 근사치입니다.
- 작업 규칙은 [ARCHITECTURE.md](./ARCHITECTURE.md) 2장을 따릅니다. docs 패키지는 보류 중이라 스토리북과 컴포넌트 위주로 작업합니다.

## 개요

| 구분        | 개수        |
| ----------- | ----------- |
| 새로 만들기 | 14 (완료 3) |
| 기존 보완   | 5           |

화면은 모두 어드민 CRUD(목록·검색·등록·상세·승인)입니다. 차트, 시세 티커, 호가창은 없었습니다.

## 권장 구현 순서

1. ~~Select, Checkbox, Radio~~ — 완료
2. ~~FormField~~ — 완료 (공개 `FormField`, 모든 컨트롤 공통 `FieldLayout`)
3. Pagination, DateRangePicker — 목록과 검색의 공통 기능
4. SideNav 접기/펼치기, FileUpload
5. Combobox, MultiSelect/TagInput, `confirm` 프리셋
6. 나머지 (RichTextEditor, SortableList, ImageCropper, MaskedInput, Toast)

---

## A. 새로 만들 것

### A-1. 폼 기본 (1순위)

- [x] **Select** — 약 52곳 (완료)
  - 단일 선택 드롭다운, "전체" 기본 옵션, 키보드 이동과 `listbox` 접근성
  - 필터와 폼의 거의 모든 선택 입력의 기반
  - 노드: `1045-178926` `1045-177509` `1507-10` `1045-174777` `1045-169999` `1045-175743` `1356-137`
- [x] **Radio / RadioGroup** — 약 20곳 (완료: `RadioGroup`만 공개, 단독 `Radio`는 없음)
  - 상호배타 선택, 그룹 방향키 이동
  - 선택에 따라 다른 필드가 활성화되는 연동(예: 신청 방식 내부/외부 링크/구글폼)
  - 노드: `1045-178668` `1045-179276` `1355-903` `1045-171613` `1045-170751` `1507-66`
- [x] **Checkbox** — 약 13곳 (완료: `Checkbox` + `CheckboxGroup`)
  - 단일 체크, 그룹, 전체선택과 부분선택(indeterminate)
  - 권한 격자(메뉴 × 권한): "조회 권한이 없으면 하위 권한 선택 불가"는 앱 규칙이고, 컨트롤은 시스템 몫
  - 노드: `1045-175019` `1045-175376`(권한 격자) `1045-181870` `1045-170425` `1507-66`

### A-2. 목록과 검색

- [ ] **Pagination** — 약 7곳
  - 이전/다음/번호/말줄임(`…`), 페이지 크기 변경("20개씩 보기")
  - 노드: `1045-174777` `1045-173953` `1045-175019` `1045-178155` `1045-174553`
- [ ] **DateRangePicker** (날짜 범위 + 일시 범위) — 약 22곳
  - 시작 ≤ 종료 검증(서로의 min/max 연동), 종료일을 비우는 "미정"
  - 프리셋: 오늘 ~ +14일, 기본 최근 7일
  - 노드: `1045-178926` `1045-174777` `1045-169441` `1045-170233` `1045-178155` `1507-66`

### A-3. 레이아웃 동작

- [ ] **SideNav 동작** — 거의 모든 화면(80+)
  - 메뉴 접기/펼치기("‹ 메뉴 접기"), 하위 메뉴 펼침, 현재 경로 활성 표시
  - 노드: 모든 화면 (예: `1045-178155` `1045-175743` `1045-172751`)

### A-4. 입력과 업로드

- [ ] **FileUpload / ImageUploader** — 약 17곳
  - 드래그 앤 드롭 + 클릭 업로드, 형식(JPG/PNG/WebP)과 용량(10MB) 검증
  - 미리보기, 교체, 업로드 실패 시 기존 이미지 유지
  - 노드: `1045-178668` `1045-181870` `1045-170425` `1349-1038` `1045-179732` `1045-170583` `1045-180644`
- [ ] **ImageCropper** — 1~2곳
  - 크롭 영역 이동, 확대/축소, 초기화 (마커 썸네일 "대표 이미지에서 크롭")
  - 노드: `1045-181356` `1045-180644`
- [x] **Combobox** (검색 후 선택) — 약 12곳 (완료: `Select searchable`로 대체)
  - asset, 가게, 회원, 장소를 검색해서 고르기(서버 조회), "유효한 ID만" 같은 검증과 연결
  - 노드: `1045-181870` `1045-179276` `1355-777` `1045-169734` `1356-137` `1507-66`
- [ ] **MultiSelect / TagInput** — 약 7곳
  - 여러 값 선택, 값을 칩으로 보여 주고 추가/제거(`BTC · USDT`, 블록체인 복수 선택, 해시태그)
  - 노드: `1507-10` `1045-176694` `1045-179276` `1045-181091` `1045-180644`
- [ ] **MaskedInput** — 1곳
  - 입력 마스크: 전화번호 `031-000-0000`, 영업시간 `10:00~22:00`
  - 노드: `1045-180644`

### A-5. 낮은 빈도

- [ ] **RichTextEditor** — 2~3곳 — 서식 있는 본문, 승인된 인라인 링크만 허용 (`1507-10` `1507-66` `1323-10`)
- [ ] **SortableList** — 1~3곳 — 행 순서 변경, `+ 질문 추가`로 행 추가/삭제. 드래그 여부는 기획서에서 확정 불가 (`1045-179276` `1045-179732`)
- [ ] **Toast** — 2곳 — 화면에는 없고 기획 주석에만 언급(저장 안내, 중복 실행 방지). **확신 낮음** (`1045-179732` `1045-176159`)

---

## B. 있는데 기능 보완이 필요한 것

- [x] **FormField** — 약 30곳 (완료: label/orientation/required/description/error 연결. "첫 오류 필드로 포커스 이동"은 앱 폼 로직으로 남김)
  - 지금은 Input에만 라벨/필수/에러/설명 연결이 있음 → **Select·Radio·Textarea 등 어떤 컨트롤에도** `htmlFor`·`aria-describedby` 연결
  - 기획서 명시: 저장 시 오류 필드 하단 사유 표시 + **"첫 오류 필드로 포커스 이동"**
  - 노드: `1045-175376` `1045-175019` `1045-171613` `1045-175743` `1045-174393` `1356-137`
- [x] **Textarea** — 3곳 (완료) — 라벨·에러·설명 연결(Input과 같은 접근성 규칙) (`1045-170751` `1045-171444` `1045-182774`)
- [ ] **`confirm` 프리셋** (`useOverlay`) — 약 5곳
  - 지금도 `Modal` + `openAsync`로 만들 수 있지만 `confirm({ title, danger })` 한 줄 호출이 없음
  - 노드: `1045-175525` `1045-172751` `1045-178155` `1045-174189`
- [ ] **DataTable의 행 선택** — 모달 안 "연동 콘텐츠 선택"에서 행 선택(Checkbox/Radio) 필요
  - 기획서가 요구한 기능은 **행 클릭 이동, 행 안 액션, 행 선택, 건수 요약**뿐. 정렬·sticky·확장 행은 명시된 곳이 없음
  - 표 자체는 마크업에 가까워서 Checkbox/Radio와 Pagination이 먼저
- [ ] **DatePicker `displayFormat`** — 2곳 — 화면은 `yyyy.mm.dd`, 현재는 `YYYY-MM-DD` 고정. 값은 그대로 두고 표시만 (`1045-173067` `1045-178155`)

---

## C. 이번에 뺀 것

### 순수 시각이라 기능 공백이 아님

Badge 의미색(tone), Button 텍스트형·작은 크기, 컨트롤 compact 밀도(32~37px), Modal 폭·닫기 X·구분선, SectionCard(번호 배지), PageHeader, Breadcrumb, Avatar, DescriptionList, Alert, StatCard, EmptyState

### 기존 컴포넌트와 기능이 겹침

- **Tabs**(밑줄형) — 단일 선택이라는 기능은 `SegmentedControl`과 같음
- **FilterBar** — `<form>` + Input + Select 조합이라 Select가 생기면 해결. Enter 조회, 초기화는 일반 폼 동작

### 도메인이라 앱에서 조합

코인맵 마커 미리보기, 주소검색 → 지오코딩, 원본/override/effective 3분할 검수, 신고 조치 패널, 지갑·거래소 연동 상태 표, 역할·권한 정책(RBAC), 방문인증 승인/반려, 상태 어휘(NORMAL/DELAY/ERROR) 표

---

## D. 열린 결정

- [x] **검색 가능한 Select**: `Select`의 `searchable` prop(+ `onSearch`, `loading`)으로 결정·구현 완료 → 별도 `Combobox`는 만들지 않음
- [ ] **여러 개 선택**(`MultiSelect/TagInput`): 별도 컴포넌트로 둘지, `Select`의 `multiple`로 넣을지

- [ ] `DateTimePicker` 스토리 `WithOverlayModal`의 스토리 전용 헬퍼 `PickerModalBody` — 이름만 `…StoryWrapper`로 바꿀지, 공개 `DateTimePanel`을 만들지
- [ ] Textarea `description`을 넣을지 (글자수와 같은 줄에 둘 때의 배치)
- [ ] `NewMessagePreview`, `Thumbnail`을 VodList처럼 도메인 컴포넌트로 보고 정리할지
- [ ] `Popover` 화면 가장자리 충돌 처리 (가로 배치 + 좁은 화면에서 팝업이 몇 px 잘림)
- [ ] `DateTimePicker`의 시각 단위 `min`/`max` 지원 여부 (지금은 날짜만)

---

## E. 이미 있는 것 (참고)

Button · IconButton · Input(label/orientation/required/error/description/addon) · Textarea(자동 높이, 글자수) · Switch · SegmentedControl · Modal · Badge · Text · Spinner · ProgressBar · ResizeHandle · Calendar · TimePanel · DatePicker · TimePicker · DateTimePicker · Popover · `useOverlay`/`OverlayProvider` · ChatBubble · EmojiPicker · NewMessagePreview · ScrollToBottomButton · Adjuster · LiveBadge · Thumbnail · 아이콘 247개
