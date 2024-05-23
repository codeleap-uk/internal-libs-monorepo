import { TypeGuards } from '@codeleap/common'
import { useEffect } from 'react'

export const keydownDefaultKeyOptions = {
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  Enter: 'Enter',
  Space: {
    key: ' ',
    code: 'Space',
  },
}

export function useKeydown(
  expectedKey: keyof typeof useKeydown.keys | { key: string; code: string },
  handler: (event: KeyboardEvent) => void,
  deps: Array<any> = [],
  options?: boolean | AddEventListenerOptions
) {
  const eventKey = TypeGuards.isString(expectedKey) ? (useKeydown?.keys?.[expectedKey] ?? expectedKey) : expectedKey

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key, code } = TypeGuards.isString(eventKey) ? { key: eventKey, code: eventKey } : eventKey

    if (event?.key === key || event?.code === code) {
      handler?.(event)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, options)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, deps)
}

useKeydown.keys = keydownDefaultKeyOptions
useKeydown.defaultKeyOptions = keydownDefaultKeyOptions
