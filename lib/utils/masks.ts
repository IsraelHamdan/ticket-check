export const cpfMask = (cpf: string): string => {
  const digits = cpf.replace(/\D/g, "");
  const limited = digits.slice(0, 11);

  return limited
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export function unmaskCpf(value: string = ""): string {
  return value.replace(/\D/g, "");
}

export function unMaskPrice(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  return parseInt(digits || "0", 10);
}

export function priceMask(rawValue: number): string {
  const cents = rawValue ?? 0;
  const value = (cents / 100).toFixed(2); // ex: 450 → "4.50"
  const [intPart, decPart] = value.split(".");
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${intFormatted},${decPart}`;
}

export function cepMask(raw: string | number): string {
  const digits = String(raw).replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function unmaskCep(masked: string): string {
  return masked.replace(/\D/g, "").slice(0, 8);
}

export function dateMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
