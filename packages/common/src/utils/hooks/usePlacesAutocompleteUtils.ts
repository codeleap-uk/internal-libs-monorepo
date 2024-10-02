import React from 'react'
import * as TypeGuards from '../typeGuards'

export type UsePlacesAutocompleteUtilsProps<T extends Record<string, any>> = {
  debounce?: number
  onValueChange?: (address: string) => void
  onPress?: (address: string, item: T) => void
}

export const usePlacesAutocompleteUtils = <T extends Record<string, any>>(props: UsePlacesAutocompleteUtilsProps<T>) => {
  const {
    debounce = 250,
    onValueChange,
    onPress,
  } = props

  const [address, setAddress] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)

  const setSearchTimeout = React.useRef<NodeJS.Timeout | null>(null)

  const handleChangeAddress = (address: string) => {
    setAddress(address)

    if (TypeGuards.isNil(debounce)) {
      onValueChange?.(address)
    } else {
      if (setSearchTimeout.current) {
        clearTimeout(setSearchTimeout.current)
      }

      setSearchTimeout.current = setTimeout(() => {
        onValueChange?.(address)
        setIsTyping(false)
      }, debounce ?? 0)
    }
  }

  const handlePressAddress = (address: string, item: T) => {
    setAddress(address)
    onPress?.(address, item)
  }

  const handleClearAddress = () => {
    setAddress('')
    onValueChange?.('')
  }

  return {
    handleChangeAddress,
    handlePressAddress,
    handleClearAddress,
    address,
    isTyping,
    setIsTyping,
  }
}
