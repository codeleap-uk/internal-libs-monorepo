import { useState } from 'react'

/**
 * Hook that manages a boolean state with toggle functionality.
 *
 * @example
 * const [isOpen, toggleOpen] = useBooleanToggle(false)
 * toggleOpen() // Toggles the value
 * toggleOpen(true) // Sets to true
 */
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
