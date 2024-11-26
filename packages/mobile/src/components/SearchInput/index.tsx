import React, { forwardRef, useState } from 'react'
import { AppIcon } from '@codeleap/styles'
import { ComponentWithDefaultProps, ForwardRefComponentWithDefaultProps } from '../../types'
import { TextInputProps, TextInput } from '../TextInput'
import { TypeGuards } from '@codeleap/common'
import { TextInput  as RNTextInput } from 'react-native'

export type SearchInputProps = {
  onTypingChange: (isTyping: boolean) => void
  onSearchChange: (search: string) => void
  onValueChange?: (search: string) => void
  onClear?: () => void
  showClear?: (search: string) => boolean
  debugName: string
  debounce?: number
  clearIcon?: AppIcon
  searchIcon?: AppIcon
  placeholder: string
} & Partial<TextInputProps>

export const SearchInput: ForwardRefComponentWithDefaultProps<SearchInputProps, RNTextInput> = forwardRef((props, ref) => {
  const {
    debugName,
    onClear,
    onSearchChange,
    onTypingChange,
    clearIcon,
    searchIcon,
    debounce,
    placeholder,
    value,
    onValueChange,
    showClear,
    ...others
  } = {
    ...SearchInput.defaultProps,
    ...props,
  }

  const [search, setSearch] = !TypeGuards.isNil(value) && !!onValueChange ? [value, onValueChange] : useState('')

  const setSearchTimeout = React.useRef<NodeJS.Timeout | null>(null)

  const handleChangeSearch = (value: string) => {
    setSearch(value)

    if (TypeGuards.isNil(debounce)) {
      onSearchChange?.(value)
    } else {
      if (setSearchTimeout.current) {
        clearTimeout(setSearchTimeout.current)
      }

      setSearchTimeout.current = setTimeout(() => {

        onSearchChange(value)
        onTypingChange?.(false)
      }, debounce ?? 0)
    }
  }

  const handleClear = () => {
    setSearch('')
    onSearchChange?.('')
    onClear?.()
  }

  return (
    <TextInput
      value={search}
      onChangeText={(value) => {
        onTypingChange?.(true)
        handleChangeSearch(value)
      }}
      placeholder={placeholder}
      debugName={`Search ${debugName}`}
      rightIcon={(showClear?.(search) ?? true) && {
        name: clearIcon,
        onPress: handleClear,
      }}
      leftIcon={{
        name: searchIcon,
      }}
      ref={ref}
      {...others}
    />
  )
})

SearchInput.defaultProps = {
  debounce: null,
  clearIcon: 'x' as AppIcon,
  searchIcon: 'search' as AppIcon,
  showClear: (s) => !!s?.trim?.()
} as Partial<SearchInputProps>
