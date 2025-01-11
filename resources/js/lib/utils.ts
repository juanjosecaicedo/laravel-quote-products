import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function priceFormat(price: string, {locale = 'es-CO', currency = 'COP'} = {}) {
  const formatter = new Intl.NumberFormat(locale, {style: 'currency', currency});
  return formatter.format(parseFloat(price));
}
