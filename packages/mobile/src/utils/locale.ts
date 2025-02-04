import { findBestLanguageTag, getLocales } from 'react-native-localize'

export function getDeviceLocale(dictionary: Record<string, any>, defaultLocale: string) {
  const deviceLocales = getLocales().map(locale => locale?.languageTag)

  const dictionaryLocales = Object.keys(dictionary)

  const possibleLocales = [...new Set([...dictionaryLocales, ...deviceLocales])]

  const bestLocale = findBestLanguageTag(possibleLocales)

  if (!bestLocale) return defaultLocale

  return bestLocale?.languageTag
}