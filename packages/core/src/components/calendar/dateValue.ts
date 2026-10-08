// 날짜 "값" 표현: `YYYY-MM-DD` 문자열 (로컬 달력 기준). Calendar / DatePicker가 주고받는 형태다.

/**
 * 로컬 시간 기준 날짜를 `YYYY-MM-DD`로 만든다.
 *
 * 주의: `date.toISOString()`은 UTC로 바꾸기 때문에 UTC+ 지역(예: 한국 UTC+9)에서
 * 로컬 자정이 **전날**로 밀린다 (2026-10-08 00:00 KST → "2026-10-07T15:00:00.000Z").
 * 날짜를 문자열로 만들 때는 이 함수를 쓴다.
 */
export function formatDateValue(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${String(date.getFullYear()).padStart(4, "0")}-${mm}-${dd}`;
}

/**
 * `YYYY-MM-DD` 문자열을 로컬 자정의 `Date`로 바꾼다.
 * 형식이 다르거나 실제로 없는 날짜(예: `2026-02-30`)면 `null`을 반환한다.
 */
export function parseDateValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  // new Date(year, ...)는 0~99년을 1900년대로 해석하므로 setFullYear로 만든다
  const date = new Date(2000, 0, 1);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  const valid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return valid ? date : null;
}
