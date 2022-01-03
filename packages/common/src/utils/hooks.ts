/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-restricted-imports */
import { useEffect, useRef, useState } from 'react'
import { AnyFunction } from '..'

export const onMount = (func:AnyFunction) => {
  useEffect(() => {
    return func()
  }, [])
}

export const onUpdate = (func:AnyFunction, listeners = []) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return func()
  }, listeners)
}

export const usePrevious = <T>(value:T) => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export function useToggle<T extends readonly [any, any], V extends T[0]|T[1]>(options: T, initial:V){
  const [value, setValue] = useState(initial)

  function toggleOrSetValue(newValue?: V){
    const v:V = newValue || options[Math.abs(options.indexOf(value) - 1)]

    setValue(v)
  }

  return [value, toggleOrSetValue] as const
}

export function useBooleanToggle(initial:boolean){
  const [v, setV] = useState(initial)

  function toggleOrSet(value?:boolean){
    if (typeof value === 'boolean'){
      setV(value)
    } else {
      setV(previous => !previous)
    }

  }

  return [v, toggleOrSet] as const
}
