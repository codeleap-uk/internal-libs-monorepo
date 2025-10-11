import { logger } from '@codeleap/logger'
import React, { MutableRefObject, useCallback, useContext, useImperativeHandle, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, ScrollViewProps } from "react-native"

const scrollProperties = [
   'scrollTo',
] satisfies (keyof ScrollView)[]

type ScrollProperty = (typeof scrollProperties)[number]

type ScrollEvents = Pick<ScrollViewProps, 'onMomentumScrollEnd'>

export type Scrollable = Pick<ScrollView, ScrollProperty> & {
  subscribe<T extends keyof ScrollEvents>(e: T, cb: ScrollEvents[T]): () => void
}

type ScrollRef = React.MutableRefObject<Scrollable>

type ScrollContextValue = {
  ref: ScrollRef
}

const noOpScrollMethods = Object.fromEntries(
  scrollProperties.map(p => [p, () => {
    logger.warn(`"${p}" was called from a ScrollProvider ref without a bound scrollable component. This does not cause errors but may impact user experience and indicate an unhandled edge case in calling code`)
  }])
)

const noOpScrollable = {
  ...noOpScrollMethods,
  subscribe(e, cb){
    return () => {}
  }
}  as Scrollable

const ScrollContext = React.createContext({} as ScrollContextValue)

export const useScrollPubSub = (ref: MutableRefObject<Omit<Scrollable,'subscribe'>>) => {
  const listeners = useRef(new Map())

  const augmentedRef = useRef<Scrollable>(null)

  const emit = useCallback((event: keyof ScrollEvents, e: NativeSyntheticEvent<NativeScrollEvent>) => {
    listeners.current.forEach((cb, key) => {
      if(key.startsWith(`${event}-`)){
        cb(e)
      }
    })
  }, [])

  useImperativeHandle(augmentedRef, () => ({
    scrollTo(...args){
      ref?.current.scrollTo(...args)
    },
    subscribe(e, cb){
      const id = `${e}-${listeners.current.size}`

      listeners.current.set(id, cb)
      
      return () => {
        listeners.current.delete(id)
      }
    }
  }), [ref])

  return {
    ref: augmentedRef,
    emit
  }
}


export const ScrollProvider = React.forwardRef<Scrollable, React.PropsWithChildren>(({children}, ref) => {
  return <ScrollContext.Provider value={{ ref: ref as ScrollRef }}>
    {children}
  </ScrollContext.Provider>
})

export function useWrappingScrollable(){
  const ctx = useContext(ScrollContext)

  if(!ctx){
    return {
      current: noOpScrollable
    }
  }
  
  return ctx.ref
}