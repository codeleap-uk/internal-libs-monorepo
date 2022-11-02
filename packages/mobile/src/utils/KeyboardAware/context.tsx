import React from 'react'
import { useCodeleapContext, useEffect, useState, useContext } from '@codeleap/common'
import {
  Keyboard,
  Platform,
  KeyboardEvent,
  KeyboardEventName,
} from 'react-native'

type KeyboardVisibilityEvents = {
    show: KeyboardEventName
    hide: KeyboardEventName
}
type TKeyboardCtx = {
  event: KeyboardEvent
  isVisible: boolean
  height: number
}
export const KeyboardCtx = React.createContext({} as TKeyboardCtx)

export const KeyboardProvider = ({ children }) => {
  const [keyboardEvent, setKeyboardEvent] = useState<KeyboardEvent>(null)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const { Theme } = useCodeleapContext()
  useEffect(() => {
    const eventNames = Platform.select<KeyboardVisibilityEvents>({
      ios: {
        show: 'keyboardWillShow',
        hide: 'keyboardWillHide',
      },
      android: {
        show: 'keyboardDidShow',
        hide: 'keyboardDidHide',
      },
    })
    const events = [
      Keyboard.addListener(eventNames.show, (e) => {

        setKeyboardEvent(e)
        setKeyboardVisible(true)
      }),
      Keyboard.addListener(eventNames.hide, (e) => {

        setKeyboardEvent(e)
        setKeyboardVisible(false)
      }),
    ]
    return () => {
      events.forEach(e => e.remove())
    }
  }, [])

  let adjustKeyboard = 0

  if (Platform.OS === 'android') {
    adjustKeyboard = Theme.values.safeAreaTop
  }
  const height = keyboardEvent?.endCoordinates?.height ?? 0

  const _return = {
    event: keyboardEvent,
    isVisible: keyboardVisible,
    height: (!!height && keyboardVisible) ? height + adjustKeyboard : 0,
    ...Keyboard,
  }

  return <KeyboardCtx.Provider value={_return}>
    {children}
  </KeyboardCtx.Provider >

}

export const useKeyboard = () => {
  return useContext(KeyboardCtx)
}
