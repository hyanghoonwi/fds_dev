import { useEffect, useId, useState } from "react";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon } from "../icon/ChevronDownIcon";
import { ChevronLeftIcon } from "../icon/ChevronLeftIcon";
import { ChevronRightIcon } from "../icon/ChevronRightIcon";

export interface SideNavItem {
  /** 메뉴를 구분하는 값. 전체 트리에서 겹치지 않아야 한다. `activeKey`와 `onNavigate`가 이 값을 쓴다. */
  key: string;
  label: string;
  /**
   * 라벨 왼쪽 아이콘(20px). 접힌 상태에서는 이 아이콘만 보이므로 **최상위 메뉴에는 꼭 넣는다.**
   * 없으면 라벨의 첫 글자가 대신 보인다.
   */
  icon?: ReactNode;
  /** 있으면 `<a href>`로 렌더링된다. 없으면 `<button>`이다. `children`이 있는 메뉴(그룹)에서는 쓰이지 않는다. */
  href?: string;
  /** 하위 메뉴. 있으면 이 메뉴는 이동하지 않고 펼침/접힘만 한다. */
  children?: SideNavItem[];
  /** 라벨 오른쪽에 붙는 요소(예: 개수 배지). 접힌 상태에서는 숨겨진다. */
  trailing?: ReactNode;
  disabled?: boolean;
}

export interface SideNavProps extends Omit<ComponentProps<"nav">, "children" | "onSelect"> {
  items: SideNavItem[];
  /** 현재 화면에 해당하는 메뉴의 `key` (제어 모드). 메뉴를 눌러도 앱이 이 값을 바꿔 줘야 활성 표시가 옮겨 간다. */
  activeKey?: string;
  /** 처음 활성 메뉴 (비제어 모드) */
  defaultActiveKey?: string;
  /**
   * 하위 없는 메뉴를 눌렀을 때 호출된다. 이미 활성인 메뉴를 눌러도 호출된다.
   * `href`가 있는 메뉴에서 라우터로 이동하려면 `event.preventDefault()`를 부른다.
   */
  onNavigate?: (key: string, event: MouseEvent<HTMLElement>) => void;
  /** 접힘 여부 (제어 모드). 접으면 아이콘만 보인다. */
  collapsed?: boolean;
  /** 처음 접힘 여부 (비제어 모드) */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** 펼쳐진 하위 메뉴 그룹의 `key` 목록 (제어 모드) */
  expandedKeys?: string[];
  /**
   * 처음 펼쳐 둘 그룹 (비제어 모드). 활성 메뉴를 가진 그룹은 목록에 없어도 항상 처음부터 펼쳐지고,
   * 활성 메뉴가 바뀔 때도 그 그룹이 펼쳐진다.
   */
  defaultExpandedKeys?: string[];
  onExpandedKeysChange?: (keys: string[]) => void;
  /** 위쪽 영역(로고 등). 펼친 상태에서 보인다. */
  header?: ReactNode;
  /** 접힌 상태의 위쪽 영역(작은 로고 등). 생략하면 접힌 상태에서는 위쪽 영역이 없다. */
  collapsedHeader?: ReactNode;
  /** 접기/펼치기 버튼을 보여 줄지. 기본 `true` */
  collapsible?: boolean;
  /** 펼친 상태의 너비(px). 기본 240 */
  width?: number;
  /** 접힌 상태의 너비(px). 기본 64 */
  collapsedWidth?: number;
}

/** `key`가 있는 메뉴까지의 그룹 경로(바깥 → 안쪽). 없으면 `null` */
function findGroupPath(items: SideNavItem[], key: string | undefined): string[] | null {
  if (key === undefined) {
    return null;
  }
  for (const item of items) {
    if (item.key === key) {
      return [];
    }
    if (item.children) {
      const inner = findGroupPath(item.children, key);
      if (inner) {
        return [item.key, ...inner];
      }
    }
  }
  return null;
}

const itemClass =
  "flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-10 px-3 py-2.5 text-left font-fds text-sm leading-5 text-text-secondary no-underline hover:bg-bg-page focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-transparent [&_svg]:size-5 [&_svg]:shrink-0";

/**
 * 어드민 왼쪽 메뉴. 접기/펼치기, 하위 메뉴 펼침, 현재 메뉴 표시를 맡는다. 라우터는 모른다 —
 * 현재 위치는 앱이 `activeKey`로 알려 주고, 이동은 `href` 또는 `onNavigate`로 처리한다.
 * 접힌 상태에서 그룹(하위 메뉴가 있는 메뉴)을 누르면 메뉴가 펼쳐지면서 그 그룹이 열린다.
 */
export function SideNav({
  items,
  activeKey: activeKeyProp,
  defaultActiveKey,
  onNavigate,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  expandedKeys: expandedKeysProp,
  defaultExpandedKeys = [],
  onExpandedKeysChange,
  header,
  collapsedHeader,
  collapsible = true,
  width = 240,
  collapsedWidth = 64,
  className,
  style,
  "aria-label": ariaLabel = "메인 메뉴",
  ref,
  ...props
}: SideNavProps) {
  const idPrefix = useId();
  const [innerActiveKey, setInnerActiveKey] = useState(defaultActiveKey);
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const activeKey = activeKeyProp ?? innerActiveKey;
  const collapsed = collapsedProp ?? innerCollapsed;
  const activePath = findGroupPath(items, activeKey) ?? [];

  const [innerExpanded, setInnerExpanded] = useState<string[]>(() => [
    ...new Set([...defaultExpandedKeys, ...activePath]),
  ]);
  const expanded = expandedKeysProp ?? innerExpanded;

  const setExpanded = (next: string[]) => {
    if (expandedKeysProp === undefined) {
      setInnerExpanded(next);
    }
    onExpandedKeysChange?.(next);
  };
  const setCollapsed = (next: boolean) => {
    if (collapsedProp === undefined) {
      setInnerCollapsed(next);
    }
    onCollapsedChange?.(next);
  };

  // 활성 메뉴가 바뀌면(뒤로 가기, 다른 곳에서의 이동) 그 메뉴를 가진 그룹을 펼친다
  const activePathKey = activePath.join("/");
  useEffect(() => {
    if (expandedKeysProp !== undefined || activePath.length === 0) {
      return;
    }
    setInnerExpanded((prev) => {
      const missing = activePath.filter((key) => !prev.includes(key));
      return missing.length > 0 ? [...prev, ...missing] : prev;
    });
    // 경로가 바뀔 때만 따라간다(사용자가 접어 둔 그룹은 같은 메뉴에 머무는 동안 그대로 둔다)
  }, [activePathKey]);

  const toggleGroup = (key: string) => {
    if (collapsed) {
      // 접힌 상태에서는 하위 메뉴를 보여 줄 자리가 없으므로 메뉴를 펼치고 그 그룹을 연다
      setCollapsed(false);
      if (!expanded.includes(key)) {
        setExpanded([...expanded, key]);
      }
      return;
    }
    setExpanded(expanded.includes(key) ? expanded.filter((k) => k !== key) : [...expanded, key]);
  };

  const renderItem = (item: SideNavItem, depth: number): ReactNode => {
    const isGroup = Boolean(item.children && item.children.length > 0);
    const isActive = item.key === activeKey;
    const hasActiveChild = isGroup && activePath.includes(item.key);
    const isOpen = isGroup && !collapsed && expanded.includes(item.key);
    const panelId = `${idPrefix}-${item.key}`;

    const stateClass = cn(
      itemClass,
      depth > 0 && "pl-11",
      isActive && "bg-bg-blue-tint font-semibold text-brand-primary hover:bg-bg-blue-tint",
      hasActiveChild && collapsed && "bg-bg-blue-tint text-brand-primary",
      hasActiveChild && !collapsed && "font-semibold text-text-primary",
      collapsed && "justify-center px-0",
    );
    // 아이콘이 없으면 접힌 상태에서도 구분할 수 있게 첫 글자를 쓴다
    const icon = collapsed
      ? (item.icon ?? <span className="text-sm font-semibold">{item.label.charAt(0)}</span>)
      : item.icon;
    const content = (
      <>
        {icon}
        {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
        {!collapsed && item.trailing}
      </>
    );

    if (isGroup) {
      return (
        <li key={item.key}>
          <button
            type="button"
            aria-expanded={collapsed ? false : isOpen}
            aria-controls={isOpen ? panelId : undefined}
            aria-label={collapsed ? item.label : undefined}
            title={collapsed ? item.label : undefined}
            aria-disabled={item.disabled || undefined}
            onClick={() => !item.disabled && toggleGroup(item.key)}
            className={stateClass}
          >
            {content}
            {!collapsed && (
              <span aria-hidden="true" className="text-text-icon-default">
                {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </span>
            )}
          </button>
          {isOpen && (
            <ul id={panelId} className="m-0 mt-0.5 flex list-none flex-col gap-0.5 p-0">
              {item.children?.map((child) => renderItem(child, depth + 1))}
            </ul>
          )}
        </li>
      );
    }

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (item.disabled) {
        event.preventDefault();
        return;
      }
      if (activeKeyProp === undefined) {
        setInnerActiveKey(item.key);
      }
      onNavigate?.(item.key, event);
    };
    const common = {
      "aria-current": isActive ? ("page" as const) : undefined,
      "aria-label": collapsed ? item.label : undefined,
      "aria-disabled": item.disabled || undefined,
      title: collapsed ? item.label : undefined,
      onClick: handleClick,
      className: stateClass,
    };
    return (
      <li key={item.key}>
        {item.href ? (
          <a {...common} href={item.disabled ? undefined : item.href}>
            {content}
          </a>
        ) : (
          <button {...common} type="button">
            {content}
          </button>
        )}
      </li>
    );
  };

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      style={{ width: collapsed ? collapsedWidth : width, ...style }}
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden border-r border-border-line bg-bg-surface font-fds transition-[width] duration-150",
        className,
      )}
      {...props}
    >
      {(collapsed ? collapsedHeader : header) && (
        <div className={cn("shrink-0 px-4 pt-4 pb-2", collapsed && "flex justify-center px-0")}>
          {collapsed ? collapsedHeader : header}
        </div>
      )}
      <ul className="m-0 flex min-h-0 flex-1 list-none flex-col gap-0.5 overflow-y-auto p-2">
        {items.map((item) => renderItem(item, 0))}
      </ul>
      {collapsible && (
        <div className="shrink-0 border-t border-border-line p-2">
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "메뉴 펼치기" : "메뉴 접기"}
            title={collapsed ? "메뉴 펼치기" : undefined}
            onClick={() => setCollapsed(!collapsed)}
            className={cn(itemClass, "text-text-tertiary", collapsed && "justify-center px-0")}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            {!collapsed && <span>메뉴 접기</span>}
          </button>
        </div>
      )}
    </nav>
  );
}
