import { ICSS } from '../types'
import { spacingShortVariants, spacingVariants } from '../types/spacing'

export function capitalize(str: string, reverse = false) {
  if (!str.length) return str
  const firstChar = reverse ? str[0].toLowerCase() : str[0].toUpperCase()
  return firstChar + str.substring(1)
}

export const spacingKeys = [
  'gap',
  'top',
  'left',
  'right',
  'bottom',
]

for (const longProperty of ['padding', 'margin']) {
  for (const variant of spacingVariants) {
    spacingKeys.push(`${longProperty}${capitalize(variant)}`)
  }
}

for (const shortProperty of ['p', 'm']) {
  for (const shortVariant of spacingShortVariants) {
    spacingKeys.push(shortProperty + shortVariant)
  }
}

export function isSpacingKey(key: string) {
  if (!key) return false

  return spacingKeys?.includes(key)
}

export function getNestedStylesByKey<T extends string>(match: string, styles: Record<T, ICSS>) {
  const stylesByKey = {}

  for (const [key, value] of Object.entries(styles)) {
    if (key.startsWith(match)) {
      const partName = capitalize(key.replace(match, ''), true)
      stylesByKey[partName] = value
    }
  }

  return stylesByKey
}
