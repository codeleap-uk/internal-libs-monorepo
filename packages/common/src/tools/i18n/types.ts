type I18NSubscriber = (locale: string) => void | Promise<void>

export type TFunction<Keys = string> = (key: Keys, ...args: any) => string

export type I18NContextType<Keys extends string = string> = {
  locale: string
  setLocale: (locale: string) => void
  t: TFunction<Keys>
  subscribe: (callback: I18NSubscriber) => () => void
  isSettingLocale: boolean
}

export type Persistor = {
  getLocale: () => Promise<string> | string
  setLocale: (locale: string) => Promise<void> | void
}
export type LanguageDictRecord = Record<string, string | object>

export type LanguageDictionary = Record<string, LanguageDictRecord>

export type I18NContextProps = React.PropsWithChildren<{
  i18n: I18nType
}>

export type I18nType<KeyPaths = string> = {
  t: TFunction<KeyPaths>
  setLocale: (locale: string) => void
  locale: string
  persistor: Persistor
  languageDictionary: LanguageDictionary
}

export type MakeI18nProps = {
  initialLocale?: string
  persistor?: Persistor
  languageDictionary?: LanguageDictionary
}
