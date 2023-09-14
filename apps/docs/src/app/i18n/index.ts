import { make18n } from '@codeleap/common'
import { IS_SSR, LocalStorageKeys } from '../constants'
import enGB from './en-GB/en-GB.json'
import ptBR from './pt-BR/pt-BR.json'

export const I18NDictionary = {
  'en-GB': enGB,
  'pt-BR': ptBR
}

const storage = () => {
  if (IS_SSR) {
    return null
  }

  return localStorage
}

export const I18N = make18n({
  initialLocale: 'en-GB',
  persistor: {
    getLocale: async () => storage()?.getItem(LocalStorageKeys.LOCALE),
    setLocale: async (locale) => storage()?.setItem(LocalStorageKeys.LOCALE, locale)
  },
  languageDictionary: I18NDictionary
})
