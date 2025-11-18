import { TypeGuards } from '@codeleap/types'
import { useState } from 'react'

/**
 * Hook that manages modal visibility state with open, close, and toggle functions.
 *
 * @example
 * const modal = useModal()
 * modal.open() // Opens modal
 * modal.close() // Closes modal
 * modal.toggle() // Toggles visibility
 * modal.toggle(true) // Forces open
 */
export function useModal(startsOpen = false) {
  const [visible, setVisible] = useState(startsOpen)

  function open() {
    setVisible(true)
  }

  function close() {
    setVisible(false)
  }

  function toggle(forceVisible?: boolean) {
    setVisible(prev => TypeGuards.isBoolean(forceVisible) ? forceVisible : !prev)
  }

  return {
    visible,
    toggle,
    open,
    close,
  }
}
