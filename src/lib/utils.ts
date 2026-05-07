import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | null,
  currency: string = "MAD"
): string {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: currency === "MAD" ? "MAD" : currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTuitionRange(
  min: number | null,
  max: number | null,
  currency: string = "MAD"
): string {
  if (min === null && max === null) return "Gratuit";
  if (min === 0 && max === 0) return "Gratuit";
  if (min === null) return `Jusqu'à ${formatCurrency(max, currency)}`;
  if (max === null) return `À partir de ${formatCurrency(min, currency)}`;
  if (min === max) return formatCurrency(min, currency);
  return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function parseArrayField(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
}
