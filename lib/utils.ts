import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// format eg - February 24 2025
export const formatToLocalDate = (date: Date) => date.toLocaleString(navigator.language, { day: 'numeric', month: 'long', year: 'numeric' })

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export const isNextWeekAvailable = (currentDate: Date) => {
  return new Date(currentDate).setDate(currentDate.getDate() + 7) > new Date().getTime();
}

export const formatWeek = (date: Date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: '2-digit' };
  return `${startOfWeek.toLocaleDateString(undefined, options)} - ${endOfWeek.toLocaleDateString(undefined, options)}`;
};