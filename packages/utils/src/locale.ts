import { AnyRecord } from '@codeleap/types'

export function getSimilarLocale(
  locale: string,
  defaultLocale: string,
  languageDictionary: AnyRecord,
) {
  const inputFirstPart = locale.substring(0, 2)
  const keys = Object.keys(languageDictionary)
  for (const key of keys) {
    const keyFirstPart = key.substring(0, 2)
    if (inputFirstPart === keyFirstPart) return key
  }
  return defaultLocale
}