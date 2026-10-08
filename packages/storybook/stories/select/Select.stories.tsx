import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Input, Modal, Select } from "@fds/core";
import type { SelectOption } from "@fds/core";

// 검색형 Select 확인용 데이터: 영문/한글이 섞인 asset 목록
const assetOptions: SelectOption[] = [
  ["BTC", "비트코인 (BTC)"],
  ["ETH", "이더리움 (ETH)"],
  ["XRP", "리플 (XRP)"],
  ["SOL", "솔라나 (SOL)"],
  ["ADA", "에이다 (ADA)"],
  ["DOGE", "도지코인 (DOGE)"],
  ["TRX", "트론 (TRX)"],
  ["AVAX", "아발란체 (AVAX)"],
  ["LINK", "체인링크 (LINK)"],
  ["DOT", "폴카닷 (DOT)"],
  ["MATIC", "폴리곤 (MATIC)"],
  ["LTC", "라이트코인 (LTC)"],
  ["BCH", "비트코인캐시 (BCH)"],
  ["ATOM", "코스모스 (ATOM)"],
  ["XLM", "스텔라루멘 (XLM)"],
  ["ETC", "이더리움클래식 (ETC)"],
  ["NEAR", "니어프로토콜 (NEAR)"],
  ["APT", "앱토스 (APT)"],
  ["ARB", "아비트럼 (ARB)"],
  ["OP", "옵티미즘 (OP)"],
  ["UNI", "유니스왑 (UNI)"],
  ["AAVE", "에이브 (AAVE)"],
  ["MKR", "메이커 (MKR)"],
  ["SAND", "샌드박스 (SAND)"],
  ["MANA", "디센트럴랜드 (MANA)"],
  ["AXS", "엑시인피니티 (AXS)"],
  ["THETA", "쎄타토큰 (THETA)"],
  ["EOS", "이오스 (EOS)"],
  ["XTZ", "테조스 (XTZ)"],
  ["ALGO", "알고랜드 (ALGO)"],
  ["FIL", "파일코인 (FIL)"],
  ["ICP", "인터넷컴퓨터 (ICP)"],
  ["HBAR", "헤데라 (HBAR)"],
  ["VET", "비체인 (VET)"],
  ["GRT", "더그래프 (GRT)"],
  ["CRV", "커브 (CRV)"],
  ["SUI", "수이 (SUI)"],
  ["USDT", "테더 (USDT)"],
  ["USDC", "USD코인 (USDC)"],
  ["DAI", "다이 (DAI)"],
].map(([value, label]) => ({ value, label }));

// 서버 검색 시뮬레이션용: 위 목록에 가짜 토큰을 더해 큰 데이터셋을 만든다
const serverDataset: SelectOption[] = [
  ...assetOptions,
  ...Array.from({ length: 160 }, (_, i) => {
    const n = String(i + 1).padStart(3, "0");
    return { value: `TKN${n}`, label: `테스트토큰 ${i + 1} (TKN${n})` };
  }),
];

// 장소 검색용: 값(value)은 서버의 ID이고 화면에 보이는 건 이름(label)이다
const placeOptions: SelectOption[] = [
  "서울 강남구 코인카페",
  "서울 마포구 블록체인 라운지",
  "서울 성동구 성수 팝업스토어",
  "서울 종로구 광화문 센터",
  "서울 송파구 잠실 스튜디오",
  "부산 해운대구 마린 라운지",
  "부산 부산진구 서면 스페이스",
  "대구 중구 동성로 스토어",
  "인천 연수구 송도 컨벤션",
  "광주 동구 충장로 카페",
  "대전 유성구 대덕 스퀘어",
  "울산 남구 삼산 라운지",
  "세종 어진동 정부청사 앞",
  "수원 영통구 광교 스토어",
  "성남 분당구 판교 테크노",
  "제주 제주시 연동 카페",
].map((place, index) => ({ value: `place-${String(index + 1).padStart(2, "0")}`, label: place }));

// 어드민 목록 필터의 "전체" 옵션은 값이 빈 문자열("")인 실제 옵션이다 (placeholder가 아님).
const statusOptions: SelectOption[] = [
  { value: "", label: "전체" },
  { value: "pending", label: "접수대기" },
  { value: "reviewing", label: "검토중" },
  { value: "done", label: "처리완료" },
  { value: "rejected", label: "반려" },
];

const typeOptions: SelectOption[] = [
  { value: "", label: "전체" },
  { value: "event", label: "이벤트" },
  { value: "airdrop", label: "에어드랍" },
  { value: "notice", label: "공지" },
];

const roleOptions: SelectOption[] = [
  { value: "super", label: "슈퍼관리자" },
  { value: "operator", label: "운영자" },
  { value: "viewer", label: "조회 전용" },
];

// 타입어헤드 확인용: "서"를 누르면 서산, "서울"을 이어서 누르면 서울로 이동한다.
const cityOptions: SelectOption[] = [
  "가평",
  "강릉",
  "거제",
  "경주",
  "구미",
  "군산",
  "김해",
  "대구",
  "대전",
  "목포",
  "부산",
  "서산",
  "서울",
  "속초",
  "수원",
  "순천",
  "안동",
  "여수",
  "울산",
  "원주",
  "인천",
  "전주",
  "제주",
  "천안",
  "청주",
  "춘천",
  "충주",
  "통영",
  "평택",
  "포항",
  "하남",
  "화성",
].map((city) => ({ value: city, label: city }));

const meta = {
  title: "Components/Common/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    // 목록이 position: absolute로 열리므로 Docs 미리보기에 목록이 들어갈 높이를 확보한다.
    // iframe(inline: false)은 아래 Props 표의 컨트롤 변경이 반영되지 않아 인라인으로 렌더링한다.
    docs: { story: { height: "300px" } },
  },
  argTypes: {
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    label: { control: "text" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    description: { control: "text" },
    error: { control: "text" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
    maxMenuHeight: { control: "number" },
    searchable: { control: "boolean" },
    loading: { control: "boolean" },
    emptyMessage: { control: "text" },
    searchPlaceholder: { control: "text" },
    searchDelay: { control: "number" },
    selectedLabel: { control: "text" },
    onSearch: { control: false },
    onChange: { control: false },
    options: { control: false },
  },
  args: {
    options: statusOptions,
    placeholder: "상태 선택",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// "전체"(값 "")가 선택된 상태는 placeholder가 아니라 "전체"로 보인다
export const WithValue: Story = {
  args: { defaultValue: "" },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>("reviewing");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Select {...args} value={value} onChange={setValue} />
        <span style={{ fontSize: 13 }}>선택값: {JSON.stringify(value)}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="line" onClick={() => setValue(null)}>
            선택 해제
          </Button>
          <Button variant="line" onClick={() => setValue("")}>
            전체로
          </Button>
        </div>
      </div>
    );
  },
};

// 목록 화면의 필터 한 줄: 상태/유형 Select + 검색어 + 조회/초기화
export const FilterBar: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render() {
    const initial = { status: "", type: "", keyword: "" };
    const [draft, setDraft] = useState(initial);
    const [applied, setApplied] = useState(initial);

    return (
      <form
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          setApplied(draft);
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div style={{ width: 160 }}>
            <Select
              label="상태"
              options={statusOptions}
              value={draft.status}
              onChange={(status) => setDraft((prev) => ({ ...prev, status }))}
            />
          </div>
          <div style={{ width: 160 }}>
            <Select
              label="유형"
              options={typeOptions}
              value={draft.type}
              onChange={(type) => setDraft((prev) => ({ ...prev, type }))}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              label="검색어"
              placeholder="제목으로 검색"
              value={draft.keyword}
              onChange={(event) => setDraft((prev) => ({ ...prev, keyword: event.target.value }))}
            />
          </div>
          <Button type="submit" variant="primary">
            조회
          </Button>
          <Button
            variant="line"
            onClick={() => {
              setDraft(initial);
              setApplied(initial);
            }}
          >
            초기화
          </Button>
        </div>
        <pre
          style={{ margin: 0, padding: 12, background: "#f2f4f6", borderRadius: 8, fontSize: 12 }}
        >
          {`적용된 조건: ${JSON.stringify(applied)}`}
        </pre>
      </form>
    );
  },
};

// 폼: name으로 FormData에 담기고, 비어 있으면 invalid 상태가 된다
export const InForm: Story = {
  render: function Render() {
    const [submitted, setSubmitted] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    return (
      <form
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
          if (role === null) {
            setResult(null);
            return;
          }
          const data = new FormData(event.currentTarget);
          setResult(JSON.stringify(Object.fromEntries(data.entries())));
        }}
      >
        <Select
          label="역할"
          name="role"
          required
          options={roleOptions}
          value={role}
          onChange={setRole}
          placeholder="역할을 선택하세요"
          error={submitted && role === null ? "역할을 선택해 주세요." : undefined}
        />
        <Select label="상태" name="status" options={statusOptions} defaultValue="" />
        <Button type="submit" variant="primary">
          저장
        </Button>
        {result && (
          <pre
            style={{ margin: 0, padding: 12, background: "#f2f4f6", borderRadius: 8, fontSize: 12 }}
          >
            {`FormData: ${result}`}
          </pre>
        )}
      </form>
    );
  },
};

export const DisabledAndDisabledOption: Story = {
  render: function Render() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12 }}>전체 비활성</span>
          <Select options={statusOptions} defaultValue="pending" disabled />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12 }}>일부 옵션 비활성 (방향키로 건너뛰고 클릭도 안 됨)</span>
          <Select
            options={[
              { value: "", label: "전체" },
              { value: "pending", label: "접수대기" },
              { value: "reviewing", label: "검토중", disabled: true },
              { value: "done", label: "처리완료" },
              { value: "rejected", label: "반려", disabled: true },
            ]}
            defaultValue=""
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12 }}>invalid</span>
          <Select options={roleOptions} placeholder="역할 선택" invalid />
        </div>
      </div>
    );
  },
};

// 32개 항목: 목록 안에서 스크롤되고, 글자를 입력하면 해당 항목으로 이동한다
export const LongListWithTypeahead: Story = {
  args: { options: cityOptions, placeholder: "지역 선택", defaultValue: "청주" },
  render: function Render(args) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Select {...args} />
        <span style={{ fontSize: 12, color: "#5c646f" }}>
          열린 상태에서 글자를 입력해 보세요. “서”는 서산, 이어서 “울”은 서울로 이동합니다.
          Home/End, 방향키도 됩니다.
        </span>
      </div>
    );
  },
};

// 모달 안에서도 열린다. Esc는 목록을 먼저 닫고, 한 번 더 누르면 모달이 닫힌다.
// Popover는 포털이 아니라 모달 본문 안에서 열리므로, 목록이 들어갈 공간(minHeight)이 필요하다.
export const InModal: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>("");

    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          회원 등록
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          header="회원 등록"
          style={{ width: 360, minHeight: 420 }}
          actions={
            <>
              <Button variant="line" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                등록
              </Button>
            </>
          }
        >
          <Select
            label="역할"
            options={roleOptions}
            value={role}
            onChange={setRole}
            placeholder="역할을 선택하세요"
          />
          <Select label="상태" options={statusOptions} value={status} onChange={setStatus} />
        </Modal>
      </>
    );
  },
};

// 라벨은 `label` prop으로 준다. 라벨을 누르면 트리거에 포커스가 가고, 필수(`required`)면 `*`가 붙는다.
export const WithLabel: Story = {
  args: { label: "역할", required: true, options: roleOptions, placeholder: "역할을 선택하세요" },
};

// 라벨이 왼쪽에 놓인다 (Input의 `orientation="horizontal"`과 같다)
export const Horizontal: Story = {
  args: {
    label: "역할",
    orientation: "horizontal",
    options: roleOptions,
    placeholder: "역할을 선택하세요",
  },
};

// 트리거 아래 설명. 에러가 있으면 에러가 설명을 대신한다.
export const WithDescription: Story = {
  args: {
    label: "공개 범위",
    options: roleOptions,
    placeholder: "선택하세요",
    description: "변경하면 즉시 적용돼요.",
  },
};

export const WithError: Story = {
  args: {
    label: "역할",
    required: true,
    options: roleOptions,
    placeholder: "역할을 선택하세요",
    description: "운영 권한을 가진 역할만 선택할 수 있어요.",
    error: "역할을 선택해 주세요.",
  },
};

// ---- 검색 가능한 Select (`searchable`) ----

// 글자를 입력하면 목록이 걸러진다 (대소문자 무시). 첫 번째 결과가 활성화되고 Enter로 고른다.
export const Searchable: Story = {
  args: {
    searchable: true,
    label: "연결 asset",
    options: assetOptions,
    placeholder: "asset 검색/선택",
    searchPlaceholder: "이름이나 심볼로 검색",
  },
  parameters: { docs: { story: { height: "340px" } } },
};

// 선택된 값이 있으면 입력창에 라벨이 보인다. 열면 라벨이 전체 선택되어 바로 입력하면 검색어로 바뀐다.
export const SearchableWithValue: Story = {
  args: {
    searchable: true,
    label: "연결 asset",
    options: assetOptions,
    defaultValue: "ETH",
    placeholder: "asset 검색/선택",
  },
  parameters: { docs: { story: { height: "340px" } } },
};

// 서버에서 검색하는 경우: `onSearch`를 넘기면 컴포넌트는 거르지 않고, 부모가 결과로 `options`를 바꾼다.
// 빠르게 입력해도 디바운스(기본 250ms) 뒤 한 번만 요청하고, 먼저 보낸 요청의 응답은 무시한다.
export const SearchableServerSide: Story = {
  render: function Render(args) {
    const [assetId, setAssetId] = useState<string | null>(null);
    const [results, setResults] = useState<SelectOption[]>(serverDataset.slice(0, 20));
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState({ lastQuery: "", requests: 0 });
    const latestRequest = useRef(0);

    const handleSearch = (query: string) => {
      const requestId = latestRequest.current + 1;
      latestRequest.current = requestId;
      setLoading(true);
      setLog((prev) => ({ lastQuery: query, requests: prev.requests + 1 }));
      // 가짜 API: 600ms 뒤에 최대 20개를 돌려준다
      setTimeout(() => {
        // 더 최근에 보낸 요청이 있으면 이 응답은 버린다 (응답 순서가 뒤바뀌어도 안전하게)
        if (requestId !== latestRequest.current) {
          return;
        }
        const keyword = query.trim().toLowerCase();
        setResults(
          serverDataset
            .filter((option) => option.label.toLowerCase().includes(keyword))
            .slice(0, 20),
        );
        setLoading(false);
      }, 600);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Select
          {...args}
          searchable
          label="연결 asset"
          options={results}
          value={assetId}
          onChange={setAssetId}
          onSearch={handleSearch}
          loading={loading}
          placeholder="asset 검색/선택"
          description="200개 중 검색어와 맞는 최대 20개만 불러와요."
        />
        <pre style={{ margin: 0, fontSize: 12 }}>
          {JSON.stringify({ ...log, selected: assetId, shown: results.length }, null, 2)}
        </pre>
      </div>
    );
  },
  parameters: { docs: { story: { height: "420px" } } },
};

// 폼에서 쓸 때: 제출되는 값은 입력한 글자가 아니라 선택한 옵션의 `value`다
export const SearchableInForm: Story = {
  render: function Render() {
    const [place, setPlace] = useState<string | null>(null);
    const [error, setError] = useState<string | undefined>();
    const [submitted, setSubmitted] = useState<string>("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      if (!data.get("place")) {
        setError("장소를 선택해 주세요.");
        setSubmitted("");
        return;
      }
      setError(undefined);
      setSubmitted(JSON.stringify(Object.fromEntries(data.entries()), null, 2));
    };

    return (
      <form onSubmit={handleSubmit} noValidate style={{ width: 320 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Select
            searchable
            name="place"
            label="장소"
            required
            options={placeOptions}
            value={place}
            onChange={(next) => {
              setPlace(next);
              setError(undefined);
            }}
            placeholder="등록된 장소 검색"
            error={error}
          />
          <Button type="submit" variant="primary">
            저장
          </Button>
          <pre style={{ margin: 0, fontSize: 12 }}>{submitted || "제출 결과가 여기에 보여요"}</pre>
        </div>
      </form>
    );
  },
  parameters: { docs: { story: { height: "420px" } } },
};

// 라벨이 왼쪽에 있어도 목록은 입력 박스 바로 아래에 붙는다
export const SearchableHorizontal: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 460 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    searchable: true,
    label: "연결 asset",
    orientation: "horizontal",
    options: assetOptions,
    placeholder: "asset 검색/선택",
    required: true,
    error: "연결할 asset을 선택해 주세요.",
  },
  parameters: { docs: { story: { height: "360px" } } },
};

// 모달 안에서도 열린다. Esc를 누르면 목록이 먼저 닫히고, 한 번 더 누르면 모달이 닫힌다.
export const SearchableInModal: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [asset, setAsset] = useState<string | null>(null);

    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          asset 연결
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          header="asset 연결"
          style={{ width: 360, minHeight: 460 }}
          actions={
            <>
              <Button variant="line" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                연결
              </Button>
            </>
          }
        >
          <Select
            searchable
            label="연결할 asset"
            options={assetOptions}
            value={asset}
            onChange={setAsset}
            placeholder="asset 검색/선택"
          />
        </Modal>
      </>
    );
  },
};
