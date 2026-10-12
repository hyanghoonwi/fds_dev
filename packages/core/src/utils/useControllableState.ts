import { useState } from "react";

/**
 * 제어/비제어 겸용 값. `value`가 `undefined`가 아니면 제어 모드(부모가 값을 가짐), 아니면 `defaultValue`로 시작해
 * 내부 state가 값을 가진다. 반환하는 `setValue`는 내부 state(비제어일 때)를 바꾸고 `onChange`를 부른다.
 * 밖으로 export하지 않는 내부 훅이다.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): readonly [T, (next: T) => void] {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const setValue = (next: T) => {
    if (!controlled) {
      setInner(next);
    }
    onChange?.(next);
  };
  return [controlled ? value : inner, setValue];
}
