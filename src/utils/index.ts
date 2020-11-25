export const safeDate = (date: any): Date | null => {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}
