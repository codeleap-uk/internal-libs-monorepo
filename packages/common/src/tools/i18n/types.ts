type I18NSubscriber = (locale: string) => void | Promise<void>

export type TFunction = (key: string, ...args: any) => string

export type I18NContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: TFunction
  subscribe: (callback: I18NSubscriber) => () => void
  isSettingLocale: boolean
}

export type Persistor = {
  getLocale: () => Promise<string> | string
  setLocale: (locale: string) => Promise<void> | void
}
export type LanguageDictRecord = Record<
  string,
  string | object
>

export type LanguageDictionary = Record<string, LanguageDictRecord>

export type I18NContextProps = React.PropsWithChildren<{
  i18n: I18nType
  persistor?: Persistor
}>

export type I18nType = {
  t: TFunction
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
