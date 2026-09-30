export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: Number.isInteger(n) ? 0 : 2 });

const DAY = 86_400_000;

export const toDate = (iso: string) => new Date(`${iso}T12:00:00`);
const pad = (n: number) => String(n).padStart(2, "0");
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const addDays = (isoDate: string, n: number) => iso(new Date(toDate(isoDate).getTime() + n * DAY));
export const daysBetween = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / DAY);

export const shortDate = (isoDate: string) =>
  toDate(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const longDate = (isoDate: string) =>
  toDate(isoDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

export const monthOf = (isoDate: string) => isoDate.slice(0, 7);
export const monthName = (isoDate: string) => toDate(isoDate).toLocaleDateString("en-US", { month: "long" });
