import { LanguageDictRecord, LanguageDictionary } from './types'

export function formatStrWithArgs(str: string, ...args: any[]) {
  let i = 0
  return str.replace(/%s/g, () => args[i++])
}

export function replaceVariables(str: string, args: any) {
  if (!args) return str

  const regex = /{{(.*?)}}/g
  return str.replace(regex, (_, match) => {
    const variableName = match.trim()
    return args[variableName] || variableName
  })
}

export function getNestedValues(
  languageDictionary: LanguageDictRecord,
  key: string,
): string {
  const properties = key.split('.')
  const nestedProp = properties.reduce(
    (nestedObj, property) => nestedObj && nestedObj[property],
    languageDictionary,
  )

  return typeof nestedProp === 'string' ? nestedProp : key
}

export function getSimilarLocale(
  locale: string,
  defaultLocale: string,
  languageDictionary: LanguageDictionary,
) {
  const inputFirstPart = locale.substring(0, 2)
  const keys = Object.keys(languageDictionary)
  for (const key of keys) {
    const keyFirstPart = key.substring(0, 2)
    if (inputFirstPart === keyFirstPart) return key
  }
  return defaultLocale
}
