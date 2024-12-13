import { TypeGuards } from '@codeleap/types'
import { useState } from 'react'

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
