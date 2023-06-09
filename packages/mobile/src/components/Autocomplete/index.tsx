import {
  useDefaultComponentStyle,
  TypeGuards,
  useNestedStylesByKey,
  FormTypes,
  onMount,
  useSearch,
} from '@codeleap/common'
import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { List } from '../List'
import { SearchInput } from '../TextInput'
import { AutocompletePresets } from './styles'
import { AutocompleteProps } from './types'
import { Button } from '../Button'
import { View } from '../View'
export * from './styles'

const defaultFilterFunction = (search: string, options: FormTypes.Options<any>) => {
  return options.filter((option) => {
    if (TypeGuards.isString(option.label)) {
      return option.label.toLowerCase().includes(search.toLowerCase())
    }

    return option.label === search
  })
}

const defaultProps:Partial<AutocompleteProps<any, boolean>> = {
  getLabel(option) {

    if (TypeGuards.isArray(option)) {

      if (option.length === 0) return null

      return option.map(o => o.label).join(', ')

    } else {
      if (!option) return null
      return option?.label
    }
  },
  searchInputProps: {},
  selectedIcon: 'check' as any,
}

export const Autocomplete = <T extends string|number = string, Multi extends boolean = false>(autocomplete:AutocompleteProps<T, Multi>) => {
  const allProps = {
    ...defaultProps,
    ...autocomplete,
  }

  const {
    value,
    onValueChange,
    styles = {},
    options = [],
    variants,
    renderItem,

    debugName,
    placeholder = 'Select',
    itemProps = {},
    searchable = true,
    loadOptions,
    multiple = false,
    limit = null,
    defaultOptions = options,
    onLoadOptionsError,
    selectedIcon,
    loadOptionsOnMount = defaultOptions.length === 0,
    selectable = false,
    filterItems = defaultFilterFunction,
    searchInputProps: searchProps = {},
    onItemPressed = () => {},
    ...listProps
  } = allProps

  const isValueArray = TypeGuards.isArray(value) && multiple

  const {
    loading,
    setLoading,
    labelOptions,
    setLabelOptions,
    filteredOptions,
    load,
    onChangeSearch,
  } = useSearch({
    value,
    multiple,
    options,
    filterItems,
    debugName,
    defaultOptions,
    loadOptions,
    onLoadOptionsError,
  })

  onMount(() => {
    if (loadOptionsOnMount && !!loadOptions) {
      load()
    }
  })

  const variantStyles = useDefaultComponentStyle<'u:Autocomplete', typeof AutocompletePresets>('u:Autocomplete', {
    transform: StyleSheet.flatten,
    rootElement: 'inputWrapper',
    styles,
    variants,
  })

  const itemStyles = useNestedStylesByKey('item', variantStyles)

  const listStyles = useNestedStylesByKey('list', variantStyles)

  const currentOptions = searchable ? filteredOptions : defaultOptions

  const select = (selectedValue) => {

    let newValue = null

    let newOption = null
    let removedIndex = null

    if (multiple && isValueArray) {
      if (value.includes(selectedValue)) {
        removedIndex = value.findIndex(v => v === selectedValue)

        newValue = value.filter((v, i) => i !== removedIndex)

      } else {

        if (TypeGuards.isNumber(limit) && value.length >= limit) {
          return
        }

        newOption = currentOptions.find(o => o.value === selectedValue)

        newValue = [...value, selectedValue]
      }

    } else {
      newValue = selectedValue
      newOption = currentOptions.find(o => o.value === selectedValue)
    }

    onValueChange(newValue)

    if (isValueArray) {
      if (removedIndex !== null) {
        const newOptions = [...labelOptions]
        newOptions.splice(removedIndex, 1)
        setLabelOptions(newOptions)
      } else {
        setLabelOptions([...labelOptions, newOption])
      }
    } else {
      setLabelOptions([newOption])
    }

  }

  const Item = renderItem || Button

  const renderListItem = useCallback(({ item }) => {

    let selected = false

    if (multiple && isValueArray) {
      selected = value?.includes(item.value)
    } else {
      selected = value === item.value
    }

    return <Item
      debugName={`${debugName} item ${item.value}`}
      selected={selectable ? selected : false}
      text={item.label}
      item={item}
      onPress={() => {
        onItemPressed(item)
        if (selectable) {
          select(item.value)
        }
      }}
      // @ts-ignore
      rightIcon={selectedIcon}
      // @ts-ignore
      icon={selectedIcon}
      styles={itemStyles}
      {...itemProps}
    />
  }, [value, select, multiple, selectable, isValueArray])

  return <View style={variantStyles.wrapper}>
    <SearchInput
      placeholder={placeholder}
      debugName={debugName}
      onTypingChange={(isTyping) => {
        if (searchable && !!loadOptions) {
          setLoading(isTyping)
        }
      }}
      debounce={!!loadOptions ? 800 : null}
      onSearchChange={onChangeSearch}
      hideErrorMessage
      {...searchProps}
    />

    <List<any>
      data={searchable ? filteredOptions : options}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      styles={listStyles}
      // @ts-ignore
      keyExtractor={(i) => i.value}
      renderItem={renderListItem}
      fakeEmpty={loading}
      placeholder={{
        loading,
      }}
      {...listProps}
    />
  </View>
}

export * from './styles'
export * from './types'

Autocomplete.defaultProps = defaultProps
