import type { ComponentProps, CSSProperties, MouseEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

export interface ModalProps extends Omit<ComponentProps<"div">, "children" | "title"> {
  /** 열림 여부. false면 아무것도 렌더링하지 않는다. 트리거 버튼이 상태를 들고 있는 경우 이 prop으로 제어한다. */
  open?: boolean;
  onClose: () => void;
  /** `Modal.Header` / `Modal.Body` / `Modal.Actions`를 필요한 것만 골라 조합한다. */
  children: ReactNode;
  /** 뒤 배경 딤 처리. 화면 중앙 확인창류는 true(기본), 트리거 버튼 아래 뜨는 설정 메뉴류는 false. */
  dimmed?: boolean;
  /** 패널 위치. 없으면 화면 정중앙. 트리거 버튼 기준으로 띄우려면 top/left/right/bottom을 넘긴다. */
  position?: CSSProperties;
}

// createPortal(document.body)을 쓰지 않는다 — 다크 모드 data-theme 스코프가 컴포넌트의 실제 DOM 위치에만 걸려있을 수
// 있어 body로 빼면 테마 토큰이 내려오지 않는다. position: fixed라 DOM 안에 있어도 뷰포트 전체를 덮는다.
// 현재 열려 있는 모달들(열린 순서). Esc를 맨 위 모달에만 전달하는 데 쓴다.
const openModals: symbol[] = [];

function ModalRoot({
  open = true,
  onClose,
  children,
  dimmed = true,
  position,
  className,
  style,
  ref,
  ...props
}: ModalProps) {
  // onClose가 렌더마다 새로 만들어져도 리스너를 다시 달지 않도록 ref로 최신 값을 가리킨다
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Esc는 가장 위에 열린 모달(열린 순서상 마지막) 하나만 닫는다
  useEffect(() => {
    if (!open) {
      return;
    }

    const token = Symbol("modal");
    openModals.push(token);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openModals[openModals.length - 1] === token) {
        onCloseRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      openModals.splice(openModals.indexOf(token), 1);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[1000] bg-transparent transition-colors duration-150",
        dimmed && "bg-black/40",
      )}
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute box-border max-h-[calc(100vh-32px)] max-w-[calc(100vw-32px)] overflow-auto rounded-24 bg-bg-surface py-5 font-fds shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
          !position && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          className,
        )}
        style={{ ...position, ...style }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

/** 제목 영역. 생략하면 제목 없는 알림형 모달이 된다(Figma 40:479). */
function ModalHeader({ className, ...props }: ComponentProps<"h2">) {
  return (
    <div className="px-5 pb-3.5">
      <h2 className={cn("m-0 text-lg font-semibold text-text-primary", className)} {...props} />
    </div>
  );
}

/** 본문 영역. 자식들을 세로 gap으로 쌓는다. */
function ModalBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-5 px-5 pt-2 pb-6", className)} {...props} />;
}

/** 하단 액션 버튼 줄. 버튼 1개는 전체 폭, 2개는 균등 분할로 채운다. */
function ModalActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-2 px-5 [&>*]:flex-1", className)} {...props} />;
}

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Actions: ModalActions,
});
