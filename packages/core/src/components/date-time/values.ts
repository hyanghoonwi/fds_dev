// 날짜·시간 "값" 표현 모음. 컴포넌트가 주고받는 값은 모두 **문자열, 로컬 시간 기준, 시간대 정보 없음**이다
// (`<input type="date" | "time" | "datetime-local">`이 쓰는 형태와 같다).
//
//   날짜        `YYYY-MM-DD`        "2026-10-15"
//   시간        `HH:mm` (24시간)     "09:30"
//   날짜+시간   `YYYY-MM-DDTHH:mm`  "2026-10-15T09:30"
//
// `Date`가 필요하면 `parseDateValue` / `formatDateValue`를 쓴다.
import { addDays, startOfDay } from "./dateUtils";

// ---- 날짜 ---------------------------------------------------------------------------------

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

/** 형식이 잘못된 값(`null`, 빈 문자열 포함)은 `null`로 보고, 올바르면 정규화된 `YYYY-MM-DD`를 돌려준다. */
export function normalizeDateValue(value: string | null | undefined): string | null {
  const parsed = value ? parseDateValue(value) : null;
  return parsed ? formatDateValue(parsed) : null;
}

// ---- 시간 ---------------------------------------------------------------------------------

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** `HH:mm` 문자열을 시/분으로 나눈다. 형식이 다르거나 범위를 벗어나면 `null`을 반환한다. */
export function parseTimeValue(
  value: string | null | undefined,
): { hour: number; minute: number } | null {
  const match = value ? TIME_PATTERN.exec(value) : null;
  return match ? { hour: Number(match[1]), minute: Number(match[2]) } : null;
}

/** 시/분을 `HH:mm`으로 만든다. */
export function formatTimeValue(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** 형식이 잘못된 값은 `null`로 보고, 올바르면 그대로 돌려준다. */
export function normalizeTimeValue(value: string | null | undefined): string | null {
  return parseTimeValue(value) ? (value ?? null) : null;
}

// ---- 날짜 + 시간 --------------------------------------------------------------------------

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

// ---- 날짜 범위 ----------------------------------------------------------------------------

/** 날짜 범위 값. 날짜는 모두 `YYYY-MM-DD` 문자열이다. */
export interface DateRangeValue {
  /** 시작일. `null`은 선택 안 함 */
  start: string | null;
  /** 종료일. `null`은 선택 안 함 */
  end: string | null;
  /**
   * 종료일이 "미정"인지(예: 기간이 정해지지 않은 이벤트). `true`이면 `end`는 `null`이고,
   * 아직 고르지 않은 것(`end: null`, `endUndecided` 없음)과 구분된다.
   */
  endUndecided?: boolean;
}

/**
 * 오늘 기준으로 며칠 전/후인 범위를 만든다. `relativeDateRange(-6, 0)`은 최근 7일(오늘 포함),
 * `relativeDateRange(0, 14)`는 오늘부터 14일 뒤까지다. 프리셋의 `value`에 함수로 넘기면 누를 때마다 새로 계산된다.
 */
export function relativeDateRange(startOffsetDays: number, endOffsetDays: number): DateRangeValue {
  const today = startOfDay(new Date());
  return {
    start: formatDateValue(addDays(today, startOffsetDays)),
    end: formatDateValue(addDays(today, endOffsetDays)),
  };
}
