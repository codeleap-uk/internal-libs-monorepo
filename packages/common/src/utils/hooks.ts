/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-restricted-imports */
import { useEffect, useRef } from 'react'
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
