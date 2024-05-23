import { useEffect } from 'react'
import { AnyFunction } from '../../types'

export const onMount = (func: AnyFunction) => {
  useEffect(() => {
    return func()
  }, [])
}
