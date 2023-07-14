import React, { useRef } from 'react'
import { I18NContextProps, I18NContextType } from './types'
import { onMount } from '../../utils'

export const I18NRef = React.createRef<I18NContextType>()

export const I18NContext = React.createContext<I18NContextType>(
  null as I18NContextType,
)

// @ts-expect-error
if (!I18NRef.current) I18NRef.current = {} as I18NContextType

export const I18NProvider = (props: I18NContextProps) => {
  const subscribers = useRef([])
  const [isSettingLocale, setIsSettingsLocale] = React.useState(false)

  const subscribe = React.useCallback((callback) => {
    subscribers.current.push(callback)
    return () => {
      subscribers.current = subscribers.current.filter((cb) => cb !== callback)
    }
  }, [])

  I18NRef.current.subscribe = subscribe

  const { children, i18n } = props
  const { locale: initialLocale, persistor } = i18n

  const callSubscribers = React.useCallback((locale: string) => {
    subscribers.current.forEach((cb) => cb(locale))
  }, [])

  const [locale, _setLocale] = React.useState<string>(() => {
    let _locale = initialLocale
    let isPromise = false
    if (persistor) {
      const persistedLocale = persistor.getLocale()

      // @ts-expect-error - TS doesn't know that a Promise has a then method
      isPromise = persistedLocale instanceof Promise || !!persistedLocale.then

      if (!isPromise) {
        // @ts-expect-error - TS doesn't know that a Promise has a then method
        _locale = persistedLocale
      }
    }
    if (!isPromise) callSubscribers(_locale)
    return _locale
  })

  I18NRef.current.locale = locale
  i18n.setLocale(locale)

  const setLocale = React.useCallback(
    async (newLocale: string) => {
      setIsSettingsLocale(true)
      I18NRef.current.locale = newLocale
      callSubscribers(newLocale)
      _setLocale(newLocale)
      persistor?.setLocale?.(newLocale)
      setTimeout(() => {
        setIsSettingsLocale(false)
      })
    },
    [callSubscribers],
  )

  I18NRef.current.setLocale = setLocale

  onMount(() => {
    if (persistor) {
      const persistedLocale = persistor.getLocale()
      // @ts-expect-error - TS doesn't know that a Promise has a then method
      const isPromise = persistedLocale instanceof Promise || TypeGuards.isFunction(persistedLocale.then)

      if (isPromise) {
        // @ts-expect-error - TS doesn't know that a Promise has a then method
        persistedLocale.then((newLocale) => {
          setLocale(newLocale || initialLocale)
        })
      }
    }
  })

  const t = React.useCallback(
    (key: string, ...args: any): string => i18n.t(key, ...args, locale),
    [locale],
  )

  I18NRef.current.t = t

  return (
    <I18NContext.Provider
      value={{
        t,
        locale,
        setLocale,
        subscribe,
        isSettingLocale,
      }}
    >
      {children}
    </I18NContext.Provider>
  )
}

export const useI18N = <Keys extends string = string>() => {
  const ctx = React.useContext(I18NContext)

  if (!ctx) {
    return {
      locale: 'en',
      setLocale: () => { },
      t: (key: Keys) => key,
      isSettingLocale: false,
    }
  }

  return ctx as I18NContextType<Keys>
}

