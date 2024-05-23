import { useState } from 'react'

export function useBooleanToggle(initial: boolean) {
  const [v, setV] = useState(initial)

  function toggleOrSet(value?: boolean) {
    if (typeof value === 'boolean') {
      setV(value)
    } else {
      setV((previous) => !previous)
    }
  }

  return [v, toggleOrSet] as const
}
