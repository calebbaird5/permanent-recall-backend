/**
 * Indicates whether the provided date is during the current day.
 * @param date
 * @returns boolean
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return today.toDateString() === date.toDateString();
}

export function isSameCalendarDate(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

export function dayBefore(date?: Date): Date {
  if (!date) date = new Date();
  let result = new Date(date);
  result.setDate(result.getDate() - 1);
  return result;
}

export function dayAfter(date?: Date): Date {
  if (!date) date = new Date();
  let result = new Date(date);
  result.setDate(result.getDate() + 1);
  return result;
}

export function weekAfter(date?: Date): Date {
  if (!date) date = new Date();
  let result = new Date(date);
  result.setDate(result.getDate() + 7);
  return result;
}

export function weekBefore(date?: Date): Date {
  if (!date) date = new Date();
  let result = new Date(date);
  result.setDate(result.getDate() - 7);
  return result;
}

export function monthAfter(date?: Date): Date {
  if (!date) date = new Date();
  let result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  return result;
}

export function monthBefore(date?: Date): Date {
  if (!date) date = new Date();
  let result = new Date(date);
  result.setMonth(result.getMonth() - 1);
  return result;
}

export function yearAfter(date?: Date): Date {
  if (!date) date = new Date();
  let result = new Date(date);
  result.setFullYear(result.getFullYear() + 1);
  return result;
}

export function yearBefore(date?: Date): Date {
  if (!date) date = new Date();
  let result = new Date(date);
  result.setFullYear(result.getFullYear() - 1);
  return result;
}
