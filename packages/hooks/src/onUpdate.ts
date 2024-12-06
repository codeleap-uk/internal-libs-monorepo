import { useEffect } from 'react'
import { AnyFunction } from '@codeleap/types'

export const onUpdate = (func: AnyFunction, listeners = []) => {
  useEffect(() => {
    return func()
  }, listeners)
}
