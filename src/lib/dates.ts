// Simple date functions
interface DateWindow {
  start: Date;
  end: Date;
}

export function get30DayWindow(baseDate?: Date): DateWindow {
  const now = baseDate ? new Date(baseDate) : new Date();
  const start = new Date(now);
  const end = new Date(now);
  
  start.setDate(now.getDate() - 15); // 15 days ago
  end.setDate(now.getDate() + 15);   // 15 days from now
  
  start.setMinutes(0, 0, 0); // Reset minutes, seconds, and milliseconds
  end.setMinutes(0, 0, 0);
  
  return { start, end };
}

export function getHoursDiff(date1: Date, date2: Date): number {
  return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
}

export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric', 
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
}