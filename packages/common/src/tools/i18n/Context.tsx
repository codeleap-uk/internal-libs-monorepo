import { useCodeleapContext } from "../../styles";
import { onMount, TypeGuards, useState } from "../../utils";
import React from 'react'
import { I18NContextProps, I18NContextType } from "./types";



export const I18NRef = React.createRef<I18NContextType>();

export const I18NContext = React.createContext<I18NContextType>({} as I18NContextType);

// @ts-expect-error
if(!I18NRef.current) I18NRef.current = {} as I18NContextType;

export const I18NProvider = (props: I18NContextProps) => {
  const { initialLocale, children, persistor, languageDictionary } = props;
  const {logger} = useCodeleapContext()

  const [locale, _setLocale] = React.useState<string>(() => {
    if (persistor) {
      const persistedLocale = persistor.getLocale();
      // @ts-expect-error - TS doesn't know that a Promise has a then method
      const isPromise = persistedLocale instanceof Promise || !!persistedLocale.then
      if(isPromise)  return initialLocale;
      return persistedLocale || initialLocale;
    }
    return initialLocale;
  });
  
  I18NRef.current.locale = locale;
  
  const setLocale = React.useCallback((locale: string) => {
    I18NRef.current.locale = locale;
    _setLocale(locale);
    persistor?.setLocale?.(locale);
  }, [persistor?.setLocale]);

  I18NRef.current.setLocale = setLocale;

  onMount(() => {
    if (persistor) {
      const persistedLocale = persistor.getLocale();
      // @ts-expect-error - TS doesn't know that a Promise has a then method
      const isPromise = persistedLocale instanceof Promise || TypeGuards.isFunction( persistedLocale.then)

      if(isPromise) {
      // @ts-expect-error - TS doesn't know that a Promise has a then method
        persistedLocale.then((locale) => {
          setLocale(locale || initialLocale);
        })
      }
    }
  })

  const t = React.useCallback((key: string, ...args: any):string => {
    const dict = languageDictionary?.[locale];
    if (!dict) return key;
    const value = dict[key];
    if (!value) {
      logger.warn(`Missing translation for key: ${key} in locale: ${locale}`);
      return key
    };
    if (TypeGuards.isFunction(value)) return value(...args);
    return value;
  }, [locale, languageDictionary]);

  I18NRef.current.t = t;


  return <I18NContext.Provider value={{
    locale,
    setLocale,
    t
  }}>
    {children}
  </I18NContext.Provider>
};

export const useI18N = () => {
  const ctx = React.useContext(I18NContext)

  if(!ctx) return {
    locale: 'en',
    setLocale: () => {},
    t: (key: string) => key
  }

  return ctx;
};
