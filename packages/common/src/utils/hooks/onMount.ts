import { useEffect } from 'react'
import { AnyFunction } from 'src/types'

export const onMount = (func: AnyFunction) => {
  useEffect(() => {
    return func()
  }, [])
}
