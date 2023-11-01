import { AnyFunction } from '@codeleap/common';
import React from 'react'

export function useResize(handler: AnyFunction, deps = []) {
  React.useEffect(() => {
    handler?.()

    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
  }, deps)
}
