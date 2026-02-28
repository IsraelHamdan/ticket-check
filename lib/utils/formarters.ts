type DateLike = Date | string | number | null | undefined;
const BR_DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

export const parseDateInput = (value: string): Date | null => {
  const input = value.trim();
  if (!input) return null;

  const brMatch = input.match(BR_DATE_REGEX);
  if (brMatch) {
    const day = Number(brMatch[1]);
    const month = Number(brMatch[2]);
    const year = Number(brMatch[3]);

    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed;
    }

    return null;
  }

  const isoMatch = input.match(ISO_DATE_REGEX);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);

    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed;
    }

    return null;
  }

  return null;
};

const asDate = (value: DateLike): Date | null => {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "string") {
    const parsedInput = parseDateInput(value);
    if (parsedInput) return parsedInput;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function formatDateToBR(value: DateLike): string {
  if (!value) return "";

  const d = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(d.getTime())) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export function parseDisplayToDate(value: string): Date | null {
  if (!value) return null;

  const [d, m, y] = value.split("/").map(Number);

  if (!d || !m || !y) return null;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > 31) return null;
  if (y < 1900) return null;

  const date = new Date(y, m - 1, d);

  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }

  return date;
}

export function formatCurrencyBR(value: number) {
  if (value == null) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

export const formatDateOnly = (value: DateLike): string | undefined => {
  const date = asDate(value);
  if (!date) return undefined;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

export const formatTimeOnly = (value: DateLike): string | undefined => {
  const date = asDate(value);
  if (!date) return undefined;

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
};

export const formatPhoneInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (rest.length <= 5) return `(${ddd}) ${rest}`;

  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
};

export const normalizeText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const toDateAtMidnight = (dateValue: string): Date => {
  const parsed = parseDateInput(dateValue);
  if (!parsed) return new Date(NaN);

  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate(),
    0,
    0,
    0,
    0,
  );
};

export const toDateTime = (dateValue: string, timeValue: string): Date => {
  const parsedDate = parseDateInput(dateValue);
  if (!parsedDate) return new Date(NaN);

  const [hour, minute] = timeValue.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return new Date(NaN);

  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
    hour,
    minute,
    0,
    0,
  );
};

export const toOptionalStringOrNull = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};
