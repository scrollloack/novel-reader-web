import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}

export const normalizeName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/i) // split on any non-alphanumeric
    .filter(Boolean) // remove empty segments
    .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('')
}
