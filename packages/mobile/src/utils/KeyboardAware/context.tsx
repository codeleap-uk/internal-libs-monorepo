import React from 'react'

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
  return {
    isVisible: false,
    height: 0,
  }
  const state = useSoftInputState()
  return {
    isVisible: state.isSoftInputShown,
    height: state.softInputHeight,
  }
}
