import React from 'react'
import { useSoftInputState } from 'react-native-avoid-softinput'

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
  const state = useSoftInputState()
  return {
    isVisible: state.isSoftInputShown,
    height: state.softInputHeight,
  }
}
