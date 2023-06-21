import { ComponentVariants, IconPlaceholder, TypeGuards } from '@codeleap/common'
import React, {
  Dispatch,
  SetStateAction,
} from 'react'
import { TextInput, TextInputPresets, TextInputProps } from '../TextInput'
import { ComponentWithDefaultProps } from '../../types/utility'

export type SearchInputProps = {
  searchValue: string
  setSearchValue: Dispatch<SetStateAction<string>>
  placeholder: string
  debugName: string
  clearIcon?: IconPlaceholder
  searchIcon?: IconPlaceholder
  debounce?: number
  onSearchChange: (search: string) => void
  onTypingChange: (isTyping: boolean) => void
  variants?: ComponentVariants<typeof TextInputPresets>['variants']
} & Partial<TextInputProps>

export const SearchInput: ComponentWithDefaultProps<SearchInputProps> = (props) => {
  const {
    debugName,
    onSearchChange,
    onTypingChange,
    searchValue,
    setSearchValue,
    placeholder,
    clearIcon,
    searchIcon,
    debounce,
    variants,
  } = {
    ...SearchInput.defaultProps,
    ...props,
  }

  const setSearchTimeout = React.useRef<NodeJS.Timeout|null>(null)

  const handleChangeSearch = (value: string) => {
    setSearchValue(value)

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
    setSearchValue('')
    onSearchChange?.('')
  }

  return (
    <TextInput
      value={searchValue}
      placeholder={placeholder}
      onChangeText={(value) => {
        onTypingChange?.(true)
        handleChangeSearch(value)
      }}
      debugName={`Search ${debugName}`}
      rightIcon={searchValue && {
        name: clearIcon,
        onPress: () => handleClear(),
      }}
      leftIcon={{
        name: searchIcon,
      }}
      variants={variants}
    />
  )
}

SearchInput.defaultProps = {
  debounce: null,
  clearIcon: 'close' as IconPlaceholder,
  searchIcon: 'search' as IconPlaceholder,
}
