import { useEffect } from 'react'
import { AnyFunction } from 'src/types'

export const onUpdate = (func: AnyFunction, listeners = []) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return func()
  }, listeners)
}
