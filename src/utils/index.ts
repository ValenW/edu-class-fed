export const safeDate = (date: any): Date | null => {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const ImageTypes: string[] = ['bmp', 'jpg', 'jpeg', 'png', 'gif']
export const VideoTypes: string[] = ['mp4', 'mov', 'wmv', 'avi', 'flv']

export const buildAcceptStr = (types: string[]): string =>
  types.map(t => `.${t.toLowerCase()}`).join(', ')
