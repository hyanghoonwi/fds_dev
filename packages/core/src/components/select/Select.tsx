import { useId, useRef, useState } from "react";
import type { ComponentProps, KeyboardEvent, MouseEvent } from "react";
import { cn } from "../../utils/cn";
import { CheckIcon } from "../icon/CheckIcon";
import { ChevronDownIcon } from "../icon/ChevronDownIcon";
import { Popover } from "../popover/Popover";

export interface SelectOption {
  /** 선택했을 때 `onChange`로 전달되는 값. 빈 문자열(`""`)도 실제 옵션 값이다(예: "전체"). */
  value: string;
  /** 트리거와 목록에 보이는 문구. 타입어헤드도 이 문구로 찾는다. */
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  ComponentProps<"button">,
  "value" | "defaultValue" | "onChange" | "children" | "role" | "type" | "name" | "required"
> {
  options: SelectOption[];
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
  /** 필수 입력 여부. `aria-required`로 전달된다. 에러 문구는 FormField의 몫이다. */
  required?: boolean;
  /** 에러 상태. 에러 링과 `aria-invalid`가 적용된다. 에러 문구는 FormField의 몫이다. */
  invalid?: boolean;
  /** 목록의 최대 높이(px). 넘으면 안에서 스크롤된다. */
  maxMenuHeight?: number;
  /** 트리거와 목록을 감싸는 컨테이너의 클래스. `className`은 트리거 버튼에만 적용된다. */
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
  invalid,
  disabled,
  maxMenuHeight = 240,
  className,
  containerClassName,
  ref,
  onKeyDown,
  onClick,
  "aria-label": ariaLabel,
  ...buttonProps
}: SelectProps) {
  const baseId = useId();
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const [open, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
  const [activeIndex, setActiveIndex] = useState(-1);
  const typeahead = useRef<{ buffer: string; timer?: ReturnType<typeof setTimeout> }>({
    buffer: "",
  });

  const controlled = value !== undefined;
  const currentValue = controlled ? value : innerValue;
  const selectedIndex =
    currentValue === null ? -1 : options.findIndex((option) => option.value === currentValue);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const isEnabled = (index: number) =>
    index >= 0 && index < options.length && !options[index].disabled;
  const firstEnabled = () => options.findIndex((option) => !option.disabled);
  const lastEnabled = () => options.findLastIndex((option) => !option.disabled);

  // 건너뛸 옵션(disabled)을 제외하고 `from`에서 dir 방향의 다음 옵션을 찾는다. 끝에서는 멈춘다(순환 없음).
  const stepFrom = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < options.length; i += dir) {
      if (isEnabled(i)) {
        return i;
      }
    }
    return from;
  };

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
  const closeMenu = () => setOpen(false);

  const select = (index: number) => {
    if (!isEnabled(index)) {
      return;
    }
    const next = options[index].value;
    if (next !== currentValue) {
      if (!controlled) {
        setInnerValue(next);
      }
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
    for (let step = 0; step < options.length; step += 1) {
      const index = (start + step) % options.length;
      if (isEnabled(index) && options[index].label.toLowerCase().startsWith(state.buffer)) {
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
    <Popover
      open={open}
      onOpenChange={setOpen}
      label={ariaLabel ?? placeholder}
      role="listbox"
      containerClassName={containerClassName}
      className="w-max max-w-80 min-w-full p-1"
      trigger={({ anchorRef, popupId }) => (
        <>
          <button
            {...buttonProps}
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
            aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
            aria-label={ariaLabel}
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
          {name !== undefined && <input type="hidden" name={name} value={currentValue ?? ""} />}
        </>
      )}
    >
      {/* 목록은 button이 아니라 팝업(listbox)의 소유다. 클릭해도 트리거의 포커스가 옮겨 가지 않게 mousedown을 막는다. */}
      <div
        ref={setScrollContainer}
        style={{ maxHeight: maxMenuHeight }}
        className="relative overflow-y-auto"
        onMouseDown={(event) => event.preventDefault()}
      >
        {options.map((option, index) => {
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
                selected ? "bg-bg-blue-tint font-semibold text-brand-primary" : "text-text-primary",
                active && !selected && "bg-bg-page",
                option.disabled && "cursor-not-allowed text-text-disabled",
              )}
            >
              <span className="truncate">{option.label}</span>
              {selected && <CheckIcon aria-hidden="true" size={16} className="shrink-0" />}
            </div>
          );
        })}
      </div>
    </Popover>
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
