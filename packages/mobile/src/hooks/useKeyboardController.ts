import { useEffect, useState } from 'react'
import { KeyboardEvents } from 'react-native-keyboard-controller'

type KeyboardControllerState = {
  height: number
  isVisible: boolean
}

export function useKeyboardController() {
  const [keyboardState, setKeyboardState] = useState<KeyboardControllerState>({ isVisible: false, height: 0 })

  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', event => {
      setKeyboardState({ isVisible: true, height: event?.height })
    })

    const hide = KeyboardEvents.addListener('keyboardWillHide', event => {
      setKeyboardState(prev => ({ isVisible: false, height: prev?.height }))
    })

    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return keyboardState
}