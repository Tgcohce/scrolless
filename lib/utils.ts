import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency
 * @param value The number to format
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formats a duration in seconds to a human-readable string
 * @param seconds Duration in seconds
 * @returns Formatted duration string (e.g., "30 days")
 */
export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))

  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"}`
  }

  return `${hours} hour${hours === 1 ? "" : "s"}`
}

/**
 * Formats a date to a human-readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | number): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

/**
 * Truncates an address to a shorter form
 * @param address The address to truncate
 * @returns Truncated address string
 */
export function truncateAddress(address: string): string {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}
