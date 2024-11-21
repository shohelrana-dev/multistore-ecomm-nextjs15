import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function truncateString(string: string, maxLength = 100) {
    if (string.length > maxLength) {
        return string.slice(0, maxLength) + '...'
    } else {
        return string
    }
}
