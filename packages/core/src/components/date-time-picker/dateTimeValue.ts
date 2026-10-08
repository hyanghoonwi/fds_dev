import { parseDateValue } from "../calendar/dateValue";

// 날짜+시간 "값" 표현: `YYYY-MM-DDTHH:mm` 문자열 (로컬 시간, 시간대 정보 없음).
// `<input type="datetime-local">`이 쓰는 형태와 같다.

const DATE_TIME_PATTERN = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * `YYYY-MM-DDTHH:mm` 문자열을 날짜(`YYYY-MM-DD`)와 시간(`HH:mm`)으로 나눈다.
 * 형식이 다르거나, 실제로 없는 날짜(예: `2026-02-30`)이거나, 시/분 범위를 벗어나면 `null`을 반환한다.
 */
export function parseDateTimeValue(value: string): { date: string; time: string } | null {
  const match = DATE_TIME_PATTERN.exec(value);
  if (!match || !parseDateValue(match[1])) {
    return null;
  }
  return { date: match[1], time: `${match[2]}:${match[3]}` };
}

/**
 * 날짜(`YYYY-MM-DD`)와 시간(`HH:mm`)을 `YYYY-MM-DDTHH:mm`으로 합친다.
 *
 * 값은 **로컬 시간**이고 시간대 정보가 없다. 서버가 UTC나 오프셋이 붙은 ISO 문자열을 요구하면
 * 값을 보내는 쪽에서 변환한다 (컴포넌트 값에는 시간대를 섞지 않는다).
 */
export function formatDateTimeValue(date: string, time: string): string {
  return `${date}T${time}`;
}
