import { IconPlaceholder, TypeGuards } from '@codeleap/common'
import React, { useState } from 'react'
import { TextInput } from '../TextInput'
import { SearchInputProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

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
    style,
    ...rest
  } = {
    ...SearchInput.defaultProps,
    ...props,
  }

  const styles = useStylesFor(SearchInput.styleRegistryName, style)

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
      style={styles}
    />
  )
}

SearchInput.styleRegistryName = 'SearchInput'

SearchInput.elements = [
  'wrapper',
  'innerWrapper',
  'label',
  'errorMessage',
  'description',
  'labelRow',
  'input',
  'placeholder',
  'selection',
  'icon',
  'leftIcon',
  'rightIcon',
]

SearchInput.rootElement = 'wrapper'

SearchInput.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return SearchInput as (props: StyledComponentProps<SearchInputProps, typeof styles>) => IJSX
}

SearchInput.defaultProps = {} as Partial<SearchInputProps>

SearchInput.defaultProps = {
  debounce: null,
  clearable: true,
  clearIcon: 'x' as IconPlaceholder,
  searchIcon: 'search' as IconPlaceholder,
  defaultValue: '',
} as Partial<SearchInputProps>

WebStyleRegistry.registerComponent(SearchInput)

export * from './styles'
export * from './types'

