import { use } from "react";
import { OverlayContext } from "./overlay-context";
import type { OverlayApi } from "./overlay-context";

/**
 * 함수 안에서 모달 등 overlay를 열고 닫는 훅. `OverlayProvider` 안에서만 쓸 수 있다.
 * 반환값(`open`, `openAsync`, `close`, `exit`, `closeAll`)은 렌더링 사이에 바뀌지 않는다.
 */
export function useOverlay(): OverlayApi {
  const api = use(OverlayContext);
  if (!api) {
    throw new Error("useOverlay는 <OverlayProvider> 안에서만 사용할 수 있어요.");
  }
  return api;
}
