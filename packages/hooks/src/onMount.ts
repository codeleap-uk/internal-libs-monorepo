import { useEffect } from 'react'
import { AnyFunction } from '@codeleap/types'

export const onMount = (func: AnyFunction) => {
  useEffect(() => {
    return func()
  }, [])
}
