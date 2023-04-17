export type I18NContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, ...args: any) => string;
};

export type Persistor = {
  getLocale: () => Promise<string> | string;
  setLocale: (locale: string) => Promise<void> | void;
}
export type LanguageDictRecord = Record<string, string | ((...args: any) => string)>;

export type I18NContextProps = React.PropsWithChildren<{
  initialLocale?: string;
  persistor?: Persistor;
  languageDictionary?: Record<string, LanguageDictRecord>;
  
}>