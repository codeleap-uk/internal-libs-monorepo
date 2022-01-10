/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-restricted-imports */
import { useEffect, useRef, useState } from 'react'
import { deepMerge } from '.'
import { AnyFunction, DeepPartial } from '..'

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

type SetPartialStateCallback<T> = (value: T) => DeepPartial<T>

export function usePartialState<T = any>(initial:T|(() => T)){
  type ValueType = T extends AnyFunction ? ReturnType<T> : T

  const [state, setState] = useState(initial)

  function setPartial(value:DeepPartial<ValueType>|SetPartialStateCallback<ValueType>){
    if (typeof value === 'function'){
      setState(v => deepMerge(v, value(v as ValueType)))
    } else {
      setState(deepMerge(state, value))
    }
  }

  return [state as ValueType, setPartial as React.Dispatch<React.SetStateAction<DeepPartial<ValueType>>>] as const
}

export function useInterval(callback:AnyFunction, interval:number){
  const intervalRef = useRef(null)
  function clear(){

    clearInterval(intervalRef.current)
    intervalRef.current = null
    
  }
  useEffect(() => {
    intervalRef.current = setInterval(callback, interval)
    return clear
  })

  return {
    clear,
    interval: intervalRef.current,
  }
}

export function useDebounce<T extends unknown>(value:T, debounce:number):T{
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
  
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, debounce)

    return () => {
      clearTimeout(timeout)
    }
    
  }, [value])
 
  return debouncedValue
}
