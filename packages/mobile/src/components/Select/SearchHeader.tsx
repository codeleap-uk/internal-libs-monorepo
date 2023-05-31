import { IconPlaceholder, TypeGuards } from '@codeleap/common'
import { useRef, useState } from 'react'
import { ComponentWithDefaultProps } from '../../types'
import { TextInput, TextInputProps } from '../TextInput'

export type SearchHeaderProps = {
  onTypingChange: (isTyping: boolean) => void
  onSearchChange: (search: string) => void
  onClear: () => void
  debugName: string
  debounce?: number
  clearIcon?: IconPlaceholder
  searchIcon?: IconPlaceholder
} & Partial<TextInputProps>

export const SearchHeader:ComponentWithDefaultProps<SearchHeaderProps> = (props) => {
  const {
    debugName,
    onClear,
    onSearchChange,
    onTypingChange,
    clearIcon,
    searchIcon,
    debounce,
  } = {
    ...SearchHeader.defaultProps,
    ...props,
  }

  const [search, setSearch] = useState('')
  // const [isTyping, setIsTyping] = useState(false)

  const setSearchTimeout = useRef<NodeJS.Timeout|null>(null)

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
      }, debounce ?? 0)
    }

  }

  const handleClear = () => {
    setSearch('')
    onSearchChange?.('')
    onClear?.()
  }

  return <>
    <TextInput
      value={search}
      onChangeText={(value) => {
        onTypingChange?.(true)
        handleChangeSearch(value)
      }}
      onEndEditing={() => {
        // setIsTyping(false)
        onTypingChange?.(false)
      }}
      placeholder='Search'
      debugName={`Search ${debugName}`}
      rightIcon={{
        name: clearIcon,
        onPress: handleClear,
      }}
      leftIcon={{
        name: searchIcon,
      }}
    />

  </>
}

SearchHeader.defaultProps = {
  debounce: null,
  clearIcon: 'x' as IconPlaceholder,
  searchIcon: 'search' as IconPlaceholder,
}
