import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import partyEmoji from "./assets/ico_party.png";
import heartEmoji from "./assets/ico_heart.png";
import thumbEmoji from "./assets/ico_thumb.png";
import clapEmoji from "./assets/ico_clap.png";
import handEmoji from "./assets/ico_hand.png";
import smileEmoji from "./assets/ico_smile.png";
import thinkEmoji from "./assets/ico_think.png";
import screamEmoji from "./assets/ico_scream.png";
import cryEmoji from "./assets/ico_cry.png";

export type EmojiPickerPlacement = "top" | "bottom";
export type EmojiPickerAlign = "start" | "end" | "center";

export interface EmojiItem {
  id: string;
  label: string;
  src: string;
}

export const DEFAULT_EMOJIS: EmojiItem[] = [
  { id: "party", label: "파티", src: partyEmoji },
  { id: "heart", label: "하트", src: heartEmoji },
  { id: "thumbup", label: "따봉", src: thumbEmoji },
  { id: "clap", label: "박수", src: clapEmoji },
  { id: "hand", label: "손인사", src: handEmoji },
  { id: "smile", label: "웃음", src: smileEmoji },
  { id: "think", label: "생각", src: thinkEmoji },
  { id: "scream", label: "스크림", src: screamEmoji },
  { id: "crying", label: "슬픔", src: cryEmoji },
];

// 텍스트와 이모지가 섞인 메시지 body에서 이모지 위치를 표시하는 마커.
// 전송 시 encodeEmojiMarker로 body에 끼워 넣고, 렌더링 시 renderEmojiMarkedText로 실제 <img>로 치환한다.
export const encodeEmojiMarker = (id: string) => `{{emoji:${id}}}`;
export const EMOJI_MARKER_REGEX = /\{\{emoji:([a-z]+)\}\}/g;

/**
 * body 안의 {{emoji:id}} 마커를 <img>로 치환하고, 나머지 일반 텍스트 구간은 renderText로 넘겨
 * 호출부가 원하는 방식(마스킹, urlify 등)으로 처리하게 한다. 마커가 없으면 renderText만 호출한다.
 */
export function renderEmojiMarkedText(
  body: string,
  emojiClassName?: string,
  renderText: (segment: string) => React.ReactNode = (segment) => segment,
  emojis: EmojiItem[] = DEFAULT_EMOJIS,
): React.ReactNode {
  if (!body.includes("{{emoji:")) {
    return renderText(body);
  }

  const nodes: React.ReactNode[] = [];
  const regex = new RegExp(EMOJI_MARKER_REGEX);
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(body))) {
    if (match.index > lastIndex) {
      nodes.push(
        <React.Fragment key={key++}>
          {renderText(body.slice(lastIndex, match.index))}
        </React.Fragment>,
      );
    }
    const emoji = emojis.find((item) => item.id === match![1]);
    if (emoji) {
      nodes.push(<img key={key++} className={emojiClassName} src={emoji.src} alt={emoji.label} />);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < body.length) {
    nodes.push(<React.Fragment key={key++}>{renderText(body.slice(lastIndex))}</React.Fragment>);
  }

  return nodes;
}

export interface EmojiPickerProps {
  icon: React.ReactNode;
  items?: EmojiItem[];
  placement?: EmojiPickerPlacement;
  align?: EmojiPickerAlign;
  offset?: number;
  /** 이모지를 고르면 패널을 닫을지 여부. 연속으로 여러 개 보내는 채팅 입력은 false(기본). */
  closeOnSelect?: boolean;
  onSelect: (emoji: EmojiItem) => void;
  className?: string;
}

export function EmojiPicker({
  icon,
  items = DEFAULT_EMOJIS,
  placement = "top",
  align = "start",
  offset = 8,
  closeOnSelect = false,
  onSelect,
  className,
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 패널 바깥을 누르면 닫는다
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideMouseDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideMouseDown);
    return () => document.removeEventListener("mousedown", handleOutsideMouseDown);
  }, [isOpen]);

  // 버튼을 눌러도 입력창의 포커스/캐럿이 유지되도록 mousedown 기본 동작(포커스 이동)을 막는다
  const preventFocusSteal = (event: React.MouseEvent) => event.preventDefault();

  const panelStyle: React.CSSProperties = {
    position: "absolute",
    ...(placement === "top"
      ? { bottom: `calc(100% + ${offset}px)` }
      : { top: `calc(100% + ${offset}px)` }),
    ...(align === "start" && { left: 0 }),
    ...(align === "end" && { right: 0 }),
    ...(align === "center" && { left: "50%", transform: "translateX(-50%)" }),
  };

  const handleSelect = (emoji: EmojiItem) => {
    onSelect(emoji);
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        className={cn(
          "flex size-[30px] cursor-pointer items-center justify-center rounded-full text-white transition-colors",
          isOpen ? "bg-foundation-blue-400" : "bg-foundation-deepblue-200",
        )}
        aria-pressed={isOpen}
        onMouseDown={preventFocusSteal}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {icon}
      </button>
      {isOpen && (
        <div
          className="flex w-[182px] flex-wrap content-center items-center gap-2 rounded-[20px] border border-border-line bg-bg-surface px-2.5 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          style={panelStyle}
        >
          {items.map((emoji) => (
            <button
              key={emoji.id}
              type="button"
              className="flex size-[30px] cursor-pointer items-center justify-center rounded-4 border-none bg-transparent transition-transform hover:scale-125 hover:bg-bg-base [&_img]:pointer-events-none"
              title={emoji.label}
              onMouseDown={preventFocusSteal}
              onClick={() => handleSelect(emoji)}
            >
              <img src={emoji.src} alt={emoji.label} width={26} height={26} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
