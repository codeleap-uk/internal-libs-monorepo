import { TypeGuards } from '../../utils'
import { I18nType, MakeI18nProps } from './types'
import { formatStrWithArgs, getNestedValues, replaceVariables } from './utils'

let locale: string

export function make18n(props: MakeI18nProps): I18nType {
  const { initialLocale, persistor, languageDictionary } = props
  locale = initialLocale

  const t = (key: string, args?: any, customLocale?: string): string => {
    const dict = languageDictionary?.[customLocale || locale]
    if (!dict) return key

    const value = getNestedValues(dict, key)

    if (!value) {
      console.warn?.(
        `Missing translation for key: ${key} in locale: ${
          customLocale || locale
        }`,
      )
      return key
    }

    if (TypeGuards.isFunction(value)) return value(args)

    if (TypeGuards.isArray(args)) return formatStrWithArgs(value, ...args)

    return replaceVariables(value, args)
  }

  const setLocale = (newLocale: string) => {
    locale = newLocale
  }

  return {
    t,
    setLocale,
    persistor,
    languageDictionary,
    locale,
  }
}
