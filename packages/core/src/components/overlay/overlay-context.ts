import { createContext } from "react";
import type { ReactNode } from "react";

/** overlay를 그리는 함수가 받는 값 */
export interface OverlayRenderProps<T = unknown> {
  /** 이 overlay의 id */
  overlayId: string;
  /** 열림 여부. false가 되면 `exitDelay` 뒤에 자동으로 제거된다. */
  isOpen: boolean;
  /** overlay를 닫는다. `openAsync`로 열었다면 넘긴 값이 Promise의 결과가 된다. */
  close: (value?: T) => void;
  /** 닫힘 애니메이션이 끝난 뒤 등, overlay를 즉시 트리에서 제거한다. */
  exit: () => void;
}

export type OverlayRender<T = unknown> = (props: OverlayRenderProps<T>) => ReactNode;

export interface OverlayOptions {
  /** overlay id. 생략하면 자동으로 만든다. 같은 id가 이미 열려 있으면 새로 열지 않는다. */
  overlayId?: string;
  /** `close` 이후 트리에서 제거하기까지 기다리는 시간(ms). 닫힘 애니메이션이 있을 때 사용. 기본 0 */
  exitDelay?: number;
}

export interface OverlayApi {
  /** overlay를 열고 id를 반환한다. */
  open: <T = void>(render: OverlayRender<T>, options?: OverlayOptions) => string;
  /**
   * overlay를 열고, 닫힐 때까지 기다렸다가 `close(value)`로 넘긴 값을 반환한다.
   * 값 없이 닫히거나(`close()`, `close(id)`, `closeAll()`) 제거되면 `undefined`가 반환된다.
   */
  openAsync: <T = void>(
    render: OverlayRender<T>,
    options?: OverlayOptions,
  ) => Promise<T | undefined>;
  /** id에 해당하는 overlay를 닫는다. */
  close: (overlayId: string) => void;
  /** id에 해당하는 overlay를 즉시 제거한다. */
  exit: (overlayId: string) => void;
  /** 열려 있는 모든 overlay를 닫는다. */
  closeAll: () => void;
}

export const OverlayContext = createContext<OverlayApi | null>(null);
