import { useEffect, useId, useMemo, useRef, useState } from "react";
import type {
  ChangeEvent,
  ComponentProps,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from "react";
import { cn } from "../../utils/cn";
import { FieldLayout } from "../_internal/FieldLayout";
import type { FieldOrientation } from "../_internal/FieldLayout";
import { CheckIcon } from "../icon/CheckIcon";
import { ChevronDownIcon } from "../icon/ChevronDownIcon";
import { Popover } from "../popover/Popover";
import { Spinner } from "../spinner/Spinner";

export interface SelectOption {
  /** 선택했을 때 `onChange`로 전달되는 값. 빈 문자열(`""`)도 실제 옵션 값이다(예: "전체"). */
  value: string;
  /** 트리거와 목록에 보이는 문구. 타입어헤드도 이 문구로 찾는다. */
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  ComponentProps<"button">,
  "value" | "defaultValue" | "onChange" | "children" | "role" | "type" | "name" | "required" | "ref"
> {
  options: SelectOption[];
  /**
   * 트리거에 연결되는 ref. 기본은 `<button>`이고, `searchable`이면 텍스트 `<input>`이다.
   */
  ref?: Ref<HTMLButtonElement | HTMLInputElement>;
  /**
   * 목록을 검색해서 고르는 모드. 트리거가 텍스트 입력(combobox)이 되고, 입력한 글자로 `options`를 걸러낸다.
   * 선택할 수 있는 값은 항상 `options` 안의 값뿐이다(입력한 글자가 값이 되는 일은 없다).
   * 서버에서 검색하려면 `onSearch`를 함께 쓴다.
   */
  searchable?: boolean;
  /**
   * 검색어가 바뀔 때 호출된다(`searchDelay`만큼 디바운스). 이걸 넘기면 컴포넌트는 직접 거르지 않고,
   * 부모가 검색 결과로 `options`를 갱신하는 것으로 본다(서버 검색). 메뉴를 닫으면 `""`로 한 번 더 호출된다.
   */
  onSearch?: (query: string) => void;
  /** `onSearch`를 부르기까지 기다리는 시간(ms). 기본 250 */
  searchDelay?: number;
  /** 검색 결과를 불러오는 중인지. 목록에 로딩 표시가 나오고 `aria-busy`가 켜진다. */
  loading?: boolean;
  /** 검색 결과가 없을 때 보이는 문구. 기본 "검색 결과가 없어요" */
  emptyMessage?: string;
  /** 검색 입력의 placeholder(메뉴가 열려 있을 때). 기본은 `placeholder`와 같다. */
  searchPlaceholder?: string;
  /**
   * 현재 값에 해당하는 옵션이 `options`에 없을 때 입력창에 보여 줄 라벨.
   * 서버 검색에서 저장된 값을 처음 보여 줄 때 쓴다(고른 뒤에는 컴포넌트가 선택한 라벨을 기억한다).
   */
  selectedLabel?: string;
  /**
   * 선택된 값 (제어 모드). `null`은 "선택 안 함"이라 `placeholder`가 보인다.
   * `""`는 값이 빈 문자열인 옵션(예: "전체")을 가리키므로 placeholder가 아니라 그 옵션이 보인다.
   */
  value?: string | null;
  /** 처음 선택된 값 (비제어 모드) */
  defaultValue?: string | null;
  /** 다른 옵션을 선택했을 때 호출된다. 이미 선택된 옵션을 다시 고르면 호출되지 않는다. */
  onChange?: (value: string) => void;
  /** 선택된 값이 없을 때 보이는 문구 */
  placeholder?: string;
  /** 폼 제출용 이름. 지정하면 선택값을 담은 숨은 `<input>`이 함께 렌더링된다. */
  name?: string;
  /** 필수 입력 여부. `aria-required`로 전달되고, 라벨이 있으면 `*`가 붙는다. */
  required?: boolean;
  /**
   * 에러 스타일만 켠다(에러 링 + `aria-invalid`). 문구는 표시하지 않는다.
   * 문구까지 보여 주려면 `error`를 쓴다.
   */
  invalid?: boolean;
  /** 라벨. 생략하면 라벨 영역이 렌더링되지 않는다. 라벨을 누르면 트리거에 포커스가 간다. */
  label?: ReactNode;
  /** 라벨 배치. vertical은 라벨이 위, horizontal은 라벨이 왼쪽에 놓인다. */
  orientation?: FieldOrientation;
  /** 가로 배치(`orientation="horizontal"`)일 때 라벨 영역의 너비(px) */
  labelWidth?: number;
  /** 트리거 아래 설명(도움말). 에러가 있으면 에러 메시지가 설명을 대신해 표시된다. */
  description?: ReactNode;
  /** 에러 메시지. 있으면 에러 스타일이 켜지고 메시지가 트리거 아래에 표시된다. */
  error?: ReactNode;
  /** 목록의 최대 높이(px). 넘으면 안에서 스크롤된다. */
  maxMenuHeight?: number;
  /** 라벨·트리거·보조 문구를 모두 감싸는 컨테이너의 클래스. `className`은 트리거(검색 모드에서는 필드 박스)에만 적용된다. */
  containerClassName?: string;
}

// 타입어헤드 입력이 이어지는 것으로 보는 간격(ms)
const TYPEAHEAD_RESET_MS = 600;

// 트리거는 Input의 필드 박스와 같은 모양(bg-page, radius 12, 높이 42px)이다.
export function Select({
  options,
  value,
  defaultValue = null,
  onChange,
  placeholder = "선택",
  name,
  required,
  invalid: invalidProp,
  disabled,
  maxMenuHeight = 240,
  label,
  orientation,
  labelWidth,
  description,
  error,
  id,
  className,
  containerClassName,
  ref,
  searchable: searchableProp,
  onSearch,
  searchDelay = 250,
  loading,
  emptyMessage = "검색 결과가 없어요",
  searchPlaceholder,
  selectedLabel,
  onKeyDown,
  onClick,
  onFocus,
  onBlur,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
  ...buttonProps
}: SelectProps) {
  const baseId = useId();
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const searchable = Boolean(searchableProp);
  const serverSide = searchable && onSearch !== undefined;

  const [open, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
  const [activeIndex, setActiveIndex] = useState(-1);
  // 입력창에 사용자가 입력한 검색어. null이면 입력하지 않은 상태(선택된 라벨을 보여 준다).
  const [query, setQuery] = useState<string | null>(null);
  // 서버 검색에서 결과가 바뀌어도 선택한 옵션의 라벨을 잃지 않도록 기억해 둔다
  const [chosenOption, setChosenOption] = useState<SelectOption | null>(null);
  const typeahead = useRef<{ buffer: string; timer?: ReturnType<typeof setTimeout> }>({
    buffer: "",
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSearch = useRef("");
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  });
  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const controlled = value !== undefined;
  const currentValue = controlled ? value : innerValue;

  // 목록에 보이는 옵션. 검색 모드에서 `onSearch`가 없으면 검색어로 직접 거른다. 인덱스는 모두 이 목록 기준이다.
  const list = useMemo(() => {
    const keyword = query?.trim().toLowerCase();
    if (!searchable || serverSide || !keyword) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(keyword));
  }, [options, searchable, serverSide, query]);

  const selectedIndex =
    currentValue === null ? -1 : list.findIndex((option) => option.value === currentValue);
  const selectedOption = (() => {
    if (currentValue === null) {
      return undefined;
    }
    const found = options.find((option) => option.value === currentValue);
    if (found || !searchable) {
      return found;
    }
    if (chosenOption?.value === currentValue) {
      return chosenOption;
    }
    return selectedLabel !== undefined ? { value: currentValue, label: selectedLabel } : undefined;
  })();

  const isEnabled = (index: number) => index >= 0 && index < list.length && !list[index].disabled;
  const firstEnabled = () => list.findIndex((option) => !option.disabled);
  const lastEnabled = () => list.findLastIndex((option) => !option.disabled);

  // 건너뛸 옵션(disabled)을 제외하고 `from`에서 dir 방향의 다음 옵션을 찾는다. 끝에서는 멈춘다(순환 없음).
  const stepFrom = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < list.length; i += dir) {
      if (isEnabled(i)) {
        return i;
      }
    }
    return from;
  };

  // 검색어나 결과가 바뀌면 첫 번째 활성 옵션으로 옮긴다. 내용이 같으면(부모가 같은 배열을 다시 만들어도) 움직이지 않는다.
  const signature = list.map((option) => option.value).join("\u0001");
  useEffect(() => {
    if (searchable && open && query !== null) {
      setActiveIndex(list.findIndex((option) => !option.disabled));
    }
  }, [signature, query]);

  const openMenu = (activeOverride?: number) => {
    if (disabled) {
      return;
    }
    setActiveIndex(
      activeOverride !== undefined
        ? activeOverride
        : isEnabled(selectedIndex)
          ? selectedIndex
          : firstEnabled(),
    );
    setOpen(true);
  };
  const closeMenu = () => {
    setOpen(false);
    if (searchable) {
      // 입력 중이던 검색어는 버리고 선택된 라벨로 되돌린다
      setQuery(null);
      clearTimeout(searchTimer.current);
      if (serverSide && lastSearch.current !== "") {
        lastSearch.current = "";
        onSearchRef.current?.("");
      }
    }
  };
  // Popover가 바깥 클릭·Esc로 닫을 때도 같은 정리를 한다
  const handleOpenChange = (next: boolean) => {
    if (next) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  const select = (index: number) => {
    if (!isEnabled(index)) {
      return;
    }
    const next = list[index].value;
    if (next !== currentValue) {
      if (!controlled) {
        setInnerValue(next);
      }
      setChosenOption(list[index]);
      onChange?.(next);
    }
    closeMenu();
  };

  // 입력한 글자로 시작하는 옵션을 찾아 활성 항목으로 옮긴다(선택은 Enter/Space/클릭으로).
  const handleTypeahead = (char: string) => {
    const state = typeahead.current;
    clearTimeout(state.timer);
    state.buffer += char.toLowerCase();
    state.timer = setTimeout(() => {
      state.buffer = "";
    }, TYPEAHEAD_RESET_MS);

    // 한 글자는 현재 항목의 다음부터(같은 글자를 반복해 누르면 다음 항목으로 넘어간다), 여러 글자는 현재 항목부터 찾는다
    const from = open ? activeIndex : selectedIndex;
    const start = state.buffer.length === 1 ? from + 1 : Math.max(from, 0);
    for (let step = 0; step < list.length; step += 1) {
      const index = (start + step) % list.length;
      if (isEnabled(index) && list[index].label.toLowerCase().startsWith(state.buffer)) {
        if (open) {
          setActiveIndex(index);
        } else {
          openMenu(index);
        }
        return;
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) {
      return;
    }
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          setActiveIndex((current) =>
            current < 0 ? firstEnabled() : stepFrom(current, event.key === "ArrowDown" ? 1 : -1),
          );
        }
        break;
      }
      case "Home":
      case "End": {
        if (open) {
          event.preventDefault();
          setActiveIndex(event.key === "Home" ? firstEnabled() : lastEnabled());
        }
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (open) {
          if (activeIndex >= 0) {
            select(activeIndex);
          } else {
            closeMenu();
          }
        } else {
          openMenu();
        }
        break;
      }
      case " ": {
        // 타입어헤드 도중의 공백은 글자로 취급한다
        if (open && typeahead.current.buffer !== "") {
          event.preventDefault();
          handleTypeahead(" ");
        } else {
          event.preventDefault();
          if (open) {
            if (activeIndex >= 0) {
              select(activeIndex);
            } else {
              closeMenu();
            }
          } else {
            openMenu();
          }
        }
        break;
      }
      case "Tab": {
        // 선택하지 않고 닫는다. 포커스 이동은 브라우저에 맡긴다.
        if (open) {
          closeMenu();
        }
        break;
      }
      default: {
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          handleTypeahead(event.key);
        }
      }
    }
  };

  // ---- 검색 모드(searchable) 핸들러 ----

  const scheduleSearch = (next: string) => {
    clearTimeout(searchTimer.current);
    if (!onSearchRef.current) {
      return;
    }
    searchTimer.current = setTimeout(() => {
      lastSearch.current = next;
      onSearchRef.current?.(next);
    }, searchDelay);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setQuery(next);
    if (!open) {
      openMenu();
    }
    scheduleSearch(next);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>);
    // 한글 등 조합 중의 Enter·방향키는 글자 확정에 쓰이므로 건드리지 않는다
    if (event.defaultPrevented || disabled || event.nativeEvent.isComposing) {
      return;
    }
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          setActiveIndex((current) =>
            current < 0 ? firstEnabled() : stepFrom(current, event.key === "ArrowDown" ? 1 : -1),
          );
        }
        break;
      }
      case "Home":
      case "End": {
        // 열려 있을 때만 목록의 처음/끝으로 간다 (닫혀 있으면 입력창의 커서 이동)
        if (open) {
          event.preventDefault();
          setActiveIndex(event.key === "Home" ? firstEnabled() : lastEnabled());
        }
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (!open) {
          openMenu();
        } else if (activeIndex >= 0) {
          select(activeIndex);
        }
        break;
      }
      case "Tab": {
        // 선택하지 않고 닫는다. 포커스 이동은 브라우저에 맡긴다.
        if (open) {
          closeMenu();
        }
        break;
      }
      default:
    }
  };

  const handleSearchFocus = (event: FocusEvent<HTMLInputElement>) => {
    onFocus?.(event as unknown as FocusEvent<HTMLButtonElement>);
    // 포커스되면 선택된 라벨 전체를 선택해 두어, 바로 입력하면 라벨이 검색어로 바뀌게 한다
    event.currentTarget.select();
  };

  const handleSearchBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event as unknown as FocusEvent<HTMLButtonElement>);
    if (open) {
      closeMenu();
    }
  };

  const handleSearchClick = (event: MouseEvent<HTMLInputElement>) => {
    onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented || disabled) {
      return;
    }
    if (!open) {
      openMenu();
      event.currentTarget.select();
    }
  };

  const handleChevronClick = () => {
    if (disabled) {
      return;
    }
    if (open) {
      closeMenu();
    } else {
      openMenu();
      inputRef.current?.focus();
    }
  };

  // 키보드로 누른 Enter/Space가 만든 click(detail === 0)은 위의 keydown이 처리했으므로 무시한다
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled || event.detail === 0) {
      return;
    }
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // 목록이 그려질 때(열 때)와 활성 항목이 바뀔 때(키보드 이동) 스크롤 영역 안에서 활성 항목이 보이게 한다.
  // effect가 아니라 콜백 ref를 쓰는 이유: Popover는 위치를 잰 뒤에야 목록을 그려서 effect 시점에는 아직 없을 수 있다.
  const setScrollContainer = (node: HTMLDivElement | null) => {
    if (node) {
      scrollOptionIntoView(node, activeIndex);
    }
  };

  return (
    <FieldLayout
      label={label}
      orientation={orientation}
      labelWidth={labelWidth}
      required={required}
      description={description}
      error={error}
      id={id}
      containerClassName={containerClassName}
    >
      {(field) => {
        const invalid = invalidProp || field.invalid;
        return (
          <Popover
            open={open}
            onOpenChange={handleOpenChange}
            label={ariaLabel ?? placeholder}
            role="listbox"
            busy={searchable && loading}
            className="w-max max-w-80 min-w-full p-1"
            trigger={({ anchorRef, popupId }) =>
              searchable ? (
                <>
                  <div
                    ref={anchorRef}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-12 bg-bg-page px-2.5 ring-inset focus-within:ring-1 focus-within:ring-brand-primary",
                      invalid && "ring-1 ring-brand-error focus-within:ring-brand-error",
                      disabled && "cursor-not-allowed opacity-50",
                      className,
                    )}
                  >
                    <input
                      {...(buttonProps as unknown as ComponentProps<"input">)}
                      id={field.id}
                      ref={(node) => {
                        inputRef.current = node;
                        if (typeof ref === "function") {
                          ref(node);
                        } else if (ref) {
                          ref.current = node;
                        }
                      }}
                      type="text"
                      role="combobox"
                      autoComplete="off"
                      spellCheck={false}
                      aria-autocomplete="list"
                      aria-haspopup="listbox"
                      aria-expanded={open}
                      aria-controls={popupId}
                      aria-activedescendant={
                        open && activeIndex >= 0 ? optionId(activeIndex) : undefined
                      }
                      aria-label={ariaLabel}
                      aria-describedby={
                        [field.describedBy, describedBy].filter(Boolean).join(" ") || undefined
                      }
                      aria-required={required || undefined}
                      aria-invalid={invalid || undefined}
                      disabled={disabled}
                      value={query !== null ? query : (selectedOption?.label ?? "")}
                      placeholder={open ? (searchPlaceholder ?? placeholder) : placeholder}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      onClick={handleSearchClick}
                      className="min-w-0 flex-1 bg-transparent py-2.5 font-fds text-sm leading-[1.571] tracking-[0.0145em] text-text-primary outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed"
                    />
                    {/* 입력창의 포커스를 빼앗지 않는 보조 토글. 키보드 사용자는 방향키로 연다. */}
                    <button
                      type="button"
                      tabIndex={-1}
                      disabled={disabled}
                      aria-label={open ? "목록 닫기" : "목록 열기"}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={handleChevronClick}
                      className="flex shrink-0 cursor-pointer items-center disabled:cursor-not-allowed"
                    >
                      <ChevronDownIcon
                        aria-hidden="true"
                        className={cn(
                          "text-text-icon-default transition-transform duration-150",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                  </div>
                  {name !== undefined && (
                    <input type="hidden" name={name} value={currentValue ?? ""} />
                  )}
                </>
              ) : (
                <>
                  <button
                    {...buttonProps}
                    id={field.id}
                    ref={(node) => {
                      anchorRef(node);
                      if (typeof ref === "function") {
                        ref(node);
                      } else if (ref) {
                        ref.current = node;
                      }
                    }}
                    type="button"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={popupId}
                    aria-activedescendant={
                      open && activeIndex >= 0 ? optionId(activeIndex) : undefined
                    }
                    aria-label={ariaLabel}
                    aria-describedby={
                      [field.describedBy, describedBy].filter(Boolean).join(" ") || undefined
                    }
                    aria-required={required || undefined}
                    aria-invalid={invalid || undefined}
                    disabled={disabled}
                    onKeyDown={handleKeyDown}
                    onClick={handleClick}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-2 rounded-12 bg-bg-page px-2.5 py-2.5 text-left font-fds text-sm leading-[1.571] tracking-[0.0145em] ring-inset outline-none focus:ring-1 focus:ring-brand-primary",
                      invalid && "ring-1 ring-brand-error focus:ring-brand-error",
                      disabled && "cursor-not-allowed opacity-50",
                      className,
                    )}
                  >
                    <span
                      className={cn(
                        "truncate",
                        selectedOption ? "text-text-primary" : "text-text-tertiary",
                      )}
                    >
                      {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className={cn(
                        "shrink-0 text-text-icon-default transition-transform duration-150",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  {name !== undefined && (
                    <input type="hidden" name={name} value={currentValue ?? ""} />
                  )}
                </>
              )
            }
          >
            {/* 목록은 button이 아니라 팝업(listbox)의 소유다. 클릭해도 트리거의 포커스가 옮겨 가지 않게 mousedown을 막는다. */}
            <div
              ref={setScrollContainer}
              style={{ maxHeight: maxMenuHeight }}
              className="relative overflow-y-auto"
              onMouseDown={(event) => event.preventDefault()}
            >
              {searchable && loading && (
                <div
                  role="presentation"
                  className="flex items-center justify-center gap-2 px-2.5 py-3 font-fds text-sm text-text-caption"
                >
                  <Spinner size={16} />
                  불러오는 중…
                </div>
              )}
              {searchable && !loading && list.length === 0 && (
                <div
                  role="presentation"
                  className="px-2.5 py-3 text-center font-fds text-sm text-text-caption"
                >
                  {emptyMessage}
                </div>
              )}
              {list.map((option, index) => {
                const selected = index === selectedIndex;
                const active = index === activeIndex;
                return (
                  <div
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={option.disabled || undefined}
                    data-index={index}
                    onClick={() => select(index)}
                    onMouseMove={() => !option.disabled && !active && setActiveIndex(index)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 rounded-8 px-2.5 py-2 font-fds text-sm select-none",
                      selected
                        ? "bg-bg-blue-tint font-semibold text-brand-primary"
                        : "text-text-primary",
                      active && !selected && "bg-bg-page",
                      option.disabled && "cursor-not-allowed text-text-disabled",
                    )}
                  >
                    <span className="truncate">
                      {searchable ? highlightMatch(option.label, query) : option.label}
                    </span>
                    {selected && <CheckIcon aria-hidden="true" size={16} className="shrink-0" />}
                  </div>
                );
              })}
            </div>
          </Popover>
        );
      }}
    </FieldLayout>
  );
}

// 검색어와 일치하는 부분만 굵게/브랜드 색으로 보여 준다. 텍스트 전체는 그대로 유지해 스크린 리더는 라벨을 그대로 읽는다.
function highlightMatch(label: string, query: string | null): ReactNode {
  const keyword = query?.trim();
  if (!keyword) {
    return label;
  }
  const start = label.toLowerCase().indexOf(keyword.toLowerCase());
  if (start < 0) {
    return label;
  }
  const end = start + keyword.length;
  return (
    <>
      {label.slice(0, start)}
      <span className="font-semibold text-brand-primary">{label.slice(start, end)}</span>
      {label.slice(end)}
    </>
  );
}

// 스크롤 컨테이너 안에서 해당 옵션이 보이도록 scrollTop만 조정한다 (페이지 스크롤은 건드리지 않는다)
function scrollOptionIntoView(container: HTMLDivElement | null, index: number) {
  const option = container?.querySelector<HTMLElement>(`[data-index="${index}"]`);
  if (!container || !option) {
    return;
  }
  const top = option.offsetTop;
  const bottom = top + option.offsetHeight;
  if (top < container.scrollTop) {
    container.scrollTop = top;
  } else if (bottom > container.scrollTop + container.clientHeight) {
    container.scrollTop = bottom - container.clientHeight;
  }
}
