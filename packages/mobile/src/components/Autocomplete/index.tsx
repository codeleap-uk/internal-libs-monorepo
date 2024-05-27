import React, { useCallback } from 'react'
import { TypeGuards, FormTypes, onMount, useSearch } from '@codeleap/common'
import { List } from '../List'
import { SearchInput } from '../SearchInput'
import { AutocompleteProps } from './types'
import { Button } from '../Button'
import { View } from '../View'
import { AnyRecord, AppIcon, useNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

const defaultFilterFunction = (search: string, options: FormTypes.Options<any>) => {
  return options.filter((option) => {
    if (TypeGuards.isString(option.label)) {
      return option.label.toLowerCase().includes(search.toLowerCase())
    }

    return option.label === search
  })
}

const defaultProps: Partial<AutocompleteProps<any, boolean>> = {
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
  selectedIcon: 'check' as AppIcon,
  searchComponent: SearchInput,
}

export const Autocomplete = <T extends string | number = string, Multi extends boolean = false>(autocomplete: AutocompleteProps<T, Multi>) => {
  const allProps = {
    ...Autocomplete.defaultProps,
    ...autocomplete,
  }

  const {
    value,
    onValueChange,
    options = [],
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
    searchComponent,
    filterItems = defaultFilterFunction,
    searchInputProps: searchProps = {},
    onItemPressed = () => { },
    listPlaceholder,
    style,
    loading: loadingProp = false,
    listProps = {},
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

  const styles = useStylesFor(Autocomplete.styleRegistryName, style)

  const itemStyles = useNestedStylesByKey('item', styles)
  const listStyles = useNestedStylesByKey('list', styles)
  const searchInputStyles = useNestedStylesByKey('searchInput', styles)

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
      style={itemStyles}
      {...itemProps}
    />
  }, [value, select, multiple, selectable, isValueArray])

  const Search = searchComponent

  const showLoading = TypeGuards.isFunction(loadingProp) ? loadingProp(loading) : (loadingProp || loading)

  return <View style={styles?.wrapper}>
    <Search
      placeholder={placeholder}
      debugName={debugName}
      onTypingChange={(isTyping) => {
        if (searchable && !!loadOptions && isTyping) {
          setLoading(isTyping)
        }
      }}
      debounce={!!loadOptions ? 800 : null}
      onSearchChange={onChangeSearch}
      hideErrorMessage
      {...searchProps}
      style={searchInputStyles}
    />

    <List<any>
      data={searchable ? filteredOptions : options}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      style={listStyles}
      // @ts-ignore
      keyExtractor={(i) => i.value}
      renderItem={renderListItem}
      loading={showLoading}
      placeholder={listPlaceholder}
      keyboardAware={false}
      {...listProps}
    />
  </View>
}

Autocomplete.styleRegistryName = 'Autocomplete'
Autocomplete.elements = ['wrapper', 'list', 'item', 'searchInput']
Autocomplete.rootElement = 'wrapper'

Autocomplete.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Autocomplete as (<T extends string | number = string, Multi extends boolean = false>(props: StyledComponentProps<AutocompleteProps<T, Multi>, typeof styles>) => IJSX)
}

Autocomplete.defaultProps = defaultProps

MobileStyleRegistry.registerComponent(Autocomplete)
