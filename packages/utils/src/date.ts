import dayjs from 'dayjs'

const removeTimezoneAndFormat = (date: any, format = 'YYYY-MM-DD') => {
  if (!date) return ''

  let normalizedDate = date

  if (date instanceof Date) {
    normalizedDate = date.toISOString().split('T')[0]
  } else if (typeof date === 'string' && date.includes('T')) {
    normalizedDate = date.split('T')[0]
  }

  return dayjs(normalizedDate).startOf('day').format(format)
}

export const dateUtils = {
  removeTimezoneAndFormat,
}