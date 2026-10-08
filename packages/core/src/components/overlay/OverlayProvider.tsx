import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { OverlayContext } from "./overlay-context";
import type { OverlayApi, OverlayOptions, OverlayRender } from "./overlay-context";

interface OverlayItem {
  id: string;
  isOpen: boolean;
  render: OverlayRender<never>;
}

export interface OverlayProviderProps {
  children: ReactNode;
}

// overlay를 DOM 안(Provider 위치)에 그린다. createPortal(document.body)을 쓰지 않는 이유는 Modal과 같다 —
// 다크 모드 data-theme 스코프가 DOM 위치에 걸려 있을 수 있어 body로 빼면 테마 토큰이 내려오지 않는다.
export function OverlayProvider({ children }: OverlayProviderProps) {
  const [items, setItems] = useState<OverlayItem[]>([]);
  const resolvers = useRef(new Map<string, (value: unknown) => void>());
  // 같은 overlayId로 openAsync를 다시 부르면 새 Promise 대신 진행 중인 Promise를 돌려주기 위한 저장소
  const pendingPromises = useRef(new Map<string, Promise<unknown>>());
  const exitDelays = useRef(new Map<string, number>());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const counter = useRef(0);

  const api = useMemo<OverlayApi & { closeWith: (id: string, value?: unknown) => void }>(() => {
    const settle = (id: string, value?: unknown) => {
      resolvers.current.get(id)?.(value);
      resolvers.current.delete(id);
      pendingPromises.current.delete(id);
    };

    const exit = (id: string) => {
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);
      exitDelays.current.delete(id);
      settle(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const closeWith = (id: string, value?: unknown) => {
      // 열린 적 없거나 이미 제거된 id는 무시한다 (제거 타이머만 남는 것을 막는다)
      if (!exitDelays.current.has(id)) {
        return;
      }
      settle(id, value);
      setItems((prev) =>
        prev.map((item) => (item.id === id && item.isOpen ? { ...item, isOpen: false } : item)),
      );
      if (!timers.current.has(id)) {
        timers.current.set(
          id,
          setTimeout(() => exit(id), exitDelays.current.get(id) ?? 0),
        );
      }
    };

    const open = <T,>(render: OverlayRender<T>, options: OverlayOptions = {}) => {
      const id = options.overlayId ?? `overlay-${counter.current++}`;
      // 닫히는 중(exitDelay 대기)이던 같은 id를 다시 열면, 예약된 제거가 새로 연 overlay를 지우지 않게 취소한다
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);
      exitDelays.current.set(id, options.exitDelay ?? 0);
      setItems((prev) =>
        prev.some((item) => item.id === id && item.isOpen)
          ? prev
          : [
              ...prev.filter((item) => item.id !== id),
              { id, isOpen: true, render: render as OverlayRender<never> },
            ],
      );
      return id;
    };

    const openAsync = <T,>(render: OverlayRender<T>, options?: OverlayOptions) => {
      // 같은 id가 이미 열려 있으면 그 Promise를 그대로 돌려준다 (앞선 Promise가 영영 끝나지 않는 것을 막는다)
      const existing = options?.overlayId && pendingPromises.current.get(options.overlayId);
      if (existing) {
        return existing as Promise<T | undefined>;
      }
      let id = "";
      const promise = new Promise<T | undefined>((resolve) => {
        id = open(render, options);
        resolvers.current.set(id, resolve as (value: unknown) => void);
      });
      pendingPromises.current.set(id, promise);
      return promise;
    };

    return {
      open,
      openAsync,
      close: (id) => closeWith(id),
      exit,
      closeAll: () => {
        for (const id of [...exitDelays.current.keys()]) {
          closeWith(id);
        }
      },
      closeWith,
    };
  }, []);

  // Provider가 사라지면 대기 중인 Promise를 모두 풀어 준다
  useEffect(() => {
    const pending = resolvers.current;
    const pendingTimers = timers.current;
    return () => {
      for (const resolve of pending.values()) {
        resolve(undefined);
      }
      pending.clear();
      pendingPromises.current.clear();
      for (const timer of pendingTimers.values()) {
        clearTimeout(timer);
      }
      pendingTimers.clear();
    };
  }, []);

  return (
    <OverlayContext value={api}>
      {children}
      {items.map(({ id, isOpen, render }) => (
        <Fragment key={id}>
          {render({
            overlayId: id,
            isOpen,
            close: (value?: unknown) => api.closeWith(id, value),
            exit: () => api.exit(id),
          } as never)}
        </Fragment>
      ))}
    </OverlayContext>
  );
}
