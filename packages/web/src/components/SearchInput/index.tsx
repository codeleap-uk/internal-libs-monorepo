import React, { useState } from 'react'
import { TextInput, TextInputProps } from '../TextInput'
import { AnyFunction, TypeGuards } from '@codeleap/common'
import { AppIcon } from '@codeleap/styles'

export type SearchInputProps = {
  placeholder: string
  clearable?: boolean
  debugName: string
  clearIcon?: AppIcon
  searchIcon?: AppIcon
  debounce?: number
  onSearchChange: (search: string) => void
  onTypingChange?: (isTyping: boolean) => void
  onValueChange?: (search: string) => void
  onClear?: AnyFunction
  defaultValue?: string
} & Partial<TextInputProps>

export const SearchInput = (props: SearchInputProps) => {
  const {
    debugName,
    onSearchChange,
    onTypingChange,
    onClear,
    clearable,
    placeholder,
    clearIcon,
    searchIcon,
    debounce,
    value,
    onValueChange,
    defaultValue,
    ...rest
  } = {
    ...SearchInput.defaultProps,
    ...props,
  }

  const hasStateProps = !TypeGuards.isNil(value) && TypeGuards.isFunction(onValueChange)

  const [search, setSearch] = hasStateProps ? [value, onValueChange] : useState(defaultValue)
  const setSearchTimeout = React.useRef<NodeJS.Timeout | null>(null)

  const handleChangeSearch = (value: string) => {
    setSearch(value)
    if (TypeGuards.isNil(debounce)) {
      onSearchChange?.(value)
    } else {
      if (!TypeGuards.isNil(setSearchTimeout.current)) {
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
    if (TypeGuards.isFunction(onClear)) onClear?.()
  }

  const showClearIcon = !!String(search)?.trim() && clearable

  return (
    <TextInput
      value={search}
      placeholder={placeholder}
      onChangeText={(value) => {
        onTypingChange?.(true)
        handleChangeSearch(value)
      }}
      debugName={`Search ${debugName}`}
      rightIcon={showClearIcon && {
        debugName: `Search ${debugName} right icon`,
        name: clearIcon,
        onPress: handleClear,
      }}
      leftIcon={{
        debugName: `Search ${debugName} left icon`,
        name: searchIcon,
      }}
      {...rest}
    />
  )
}

SearchInput.defaultProps = {
  debounce: null,
  clearable: true,
  clearIcon: 'x' as AppIcon,
  searchIcon: 'search' as AppIcon,
  defaultValue: '',
} as Partial<SearchInputProps>
