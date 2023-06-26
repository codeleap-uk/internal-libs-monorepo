import { AnyFunction, ComponentVariants, IconPlaceholder, TypeGuards } from '@codeleap/common'
import React, { useState } from 'react'
import { TextInput, TextInputPresets, TextInputProps } from '../TextInput'
import { ComponentWithDefaultProps } from '../../types/utility'

export type SearchInputProps = {
  placeholder: string
  clearable?: boolean
  debugName: string
  clearIcon?: IconPlaceholder
  searchIcon?: IconPlaceholder
  debounce?: number
  onSearchChange: (search: string) => void
  onTypingChange: (isTyping: boolean) => void
  onClear: AnyFunction
} & Partial<TextInputProps> & ComponentVariants<typeof TextInputPresets>

export const SearchInput: ComponentWithDefaultProps<SearchInputProps> = (props) => {
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
    ...rest
  } = {
    ...SearchInput.defaultProps,
    ...props,
  }
  const [search, setSearch] = useState('')
  const setSearchTimeout = React.useRef<NodeJS.Timeout|null>(null)

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
    onClear?.()
  }

  return (
    <TextInput
      value={search}
      placeholder={placeholder}
      onChangeText={(value) => {
        onTypingChange?.(true)
        handleChangeSearch(value)
      }}
      debugName={`Search ${debugName}`}
      rightIcon={search && clearable && {
        name: clearIcon,
        onPress: () => handleClear(),
      }}
      leftIcon={{
        name: searchIcon,
      }}
      {...rest}
    />
  )
}

SearchInput.defaultProps = {
  debounce: null,
  clearable: true,
  clearIcon: 'close' as IconPlaceholder,
  searchIcon: 'search' as IconPlaceholder,
}
