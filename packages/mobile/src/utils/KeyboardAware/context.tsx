import React from 'react'
import { useKeyboardController } from '../../hooks'

type TKeyboardCtx = {
  isVisible: boolean
  height: number
}

/**
 *
 * @deprecated useKeyboard does not need to be wrapped in a provider
 */
export const KeyboardProvider = ({ children }) => {
  return <>
    {children}
  </>
}

export const useKeyboard = (): TKeyboardCtx => {
  return useKeyboardController()
}
