import { useEffect } from 'react'
import { AnyFunction } from '../../types'

export const onUpdate = (func: AnyFunction, listeners = []) => {
  useEffect(() => {
    return func()
  }, listeners)
}
