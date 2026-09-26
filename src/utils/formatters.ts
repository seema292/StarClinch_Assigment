import { parseDateKey } from './availability';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Formats an amount in INR using the Indian numbering system (e.g. ₹1,25,000).
 */
export function formatINR(amount: number): string {
  return inrFormatter.format(Math.round(amount || 0));
}

/**
 * Formats an amount in compact Indian currency (e.g. ₹1.2L or ₹45k).
 */
export function formatCompactINR(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2).replace(/0$/, '')}L`;
  }
  if (amount >= 1000) {
    return `₹${Math.round(amount / 1000)}k`;
  }
  return formatINR(amount);
}

/**
 * Formats a `YYYY-MM-DD` string into a human-friendly date (e.g., "Sat, 17 Oct 2026").
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'Select a date';
  const date = parseDateKey(dateStr);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats a `YYYY-MM-DD` string into a full readable date (e.g., "Saturday, 17 October 2026").
 */
export function formatFullDate(dateStr: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'No date selected';
  const date = parseDateKey(dateStr);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
