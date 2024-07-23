import React, { useState } from 'react'
import { AppIcon } from '@codeleap/styles'
import { ComponentWithDefaultProps } from '../../types'
import { TextInputProps, TextInput } from '../TextInput'
import { TypeGuards } from '@codeleap/common'

export type SearchInputProps = {
  onTypingChange: (isTyping: boolean) => void
  onSearchChange: (search: string) => void
  onValueChange?: (search: string) => void
  onClear?: () => void
  debugName: string
  debounce?: number
  clearIcon?: AppIcon
  searchIcon?: AppIcon
  placeholder: string
} & Partial<TextInputProps>

export const SearchInput: ComponentWithDefaultProps<SearchInputProps> = (props) => {
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
      rightIcon={!!search?.trim?.() && {
        name: clearIcon,
        onPress: handleClear,
      }}
      leftIcon={{
        name: searchIcon,
      }}
      {...others}
    />
  )
}

SearchInput.defaultProps = {
  debounce: null,
  clearIcon: 'x' as AppIcon,
  searchIcon: 'search' as AppIcon,
} as Partial<SearchInputProps>
