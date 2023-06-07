import { IconPlaceholder,
  useDefaultComponentStyle,
  TypeGuards,
  useNestedStylesByKey,
  useBooleanToggle,
  FormTypes,
  onMount,
  onUpdate,
  usePrevious,
} from '@codeleap/common'
import React, { useCallback, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { List } from '../List'
import { TextInput } from '../TextInput'
import { AutocompletePresets } from './styles'
import { AutocompleteProps } from './types'
import { Button } from '../Button'
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
  // outerInputComponent: OuterInput,
  searchInputProps: {},
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
    listProps,
    debugName,
    placeholder = 'Select',
    arrowIconName = 'selectArrow',
    clearIconName,
    clearable = false,
    selectedIcon = 'selectMarker',
    inputProps = {},
    hideInput = false,
    itemProps = {},
    searchable = true,
    loadOptions,
    multiple = false,
    closeOnSelect = !multiple,
    limit = null,
    defaultOptions = options,
    visible: _visible,
    toggle: _toggle,
    ListHeaderComponent,
    onLoadOptionsError,
    loadOptionsOnMount = defaultOptions.length === 0,
    loadOptionsOnOpen = false,
    filterItems = defaultFilterFunction,
    getLabel,
    searchInputProps,
    outerInputComponent,
    ...modalProps
  } = allProps

  const [loading, setLoading] = useBooleanToggle(false)
  const [, setSearch] = useState('')
  const isValueArray = TypeGuards.isArray(value) && multiple

  const [labelOptions, setLabelOptions] = useState<FormTypes.Options<T>>(() => {
    if (isValueArray) {
      return defaultOptions.filter(o => value.includes(o.value))
    }

    const _option = defaultOptions.find(o => o.value === value)

    if (!_option) {
      return []
    }

    return [_option]
  })

  const [visible, toggle] = TypeGuards.isBoolean(_visible) && !!_toggle ? [_visible, _toggle] : useBooleanToggle(false)

  const [filteredOptions, setFilteredOptions] = useState(defaultOptions)

  async function load() {
    setLoading(true)
    try {
      const options = await loadOptions('')
      setFilteredOptions(options)
    } catch (e) {
      onLoadOptionsError(e)
    }
    setLoading(false)
  }

  onMount(() => {
    if (loadOptionsOnMount && !!loadOptions) {
      load()
    }
  })

  const prevVisible = usePrevious(visible)

  onUpdate(() => {
    if (visible && !prevVisible && loadOptionsOnOpen && !!loadOptions) {
      load()
    }
  }, [visible, prevVisible])

  const variantStyles = useDefaultComponentStyle<'u:Select', typeof AutocompletePresets>('u:Select', {
    transform: StyleSheet.flatten,
    rootElement: 'inputWrapper',
    styles,
    variants,
  })

  const itemStyles = useNestedStylesByKey('item', variantStyles)

  const listStyles = useNestedStylesByKey('list', variantStyles)

  const currentOptions = searchable ? filteredOptions : defaultOptions

  const close = () => toggle?.()

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

    if (closeOnSelect) {
      close?.()
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
      selected={selected}
      text={item.label}
      item={item}
      onPress={() => select(item.value)}
      // @ts-ignore
      icon={'check'}
      // @ts-ignore
      rightIcon={'check'}
      styles={itemStyles}
      {...itemProps}
    />
  }, [value, select, multiple])

  // ------------------------------------------------------------------------------------------------------------

  const [searchInput, setSearchInput] = useState('')

  const onChangeSearch = async (searchValue:string) => {
    setSearchInput(searchValue)

    if (!!loadOptions) {
      setLoading(true)
      try {
        const _opts = await loadOptions(searchValue)
        setFilteredOptions(_opts)
      } catch (e) {
        console.error(`Error loading select options [${debugName}]`, e)
        onLoadOptionsError?.(e)
      }
      setTimeout(() => {
        setLoading(false)
      }, 0)
      return
    }
    const _opts = filterItems(searchValue, options)
    setFilteredOptions(_opts)
  }

  const debounceTest = !!loadOptions ? 800 : null

  function onTypingChange(isTyping) {
    if (searchable && !!loadOptions) {
      setLoading(isTyping)
    }
  }

  const setSearchTimeout = useRef<NodeJS.Timeout|null>(null)

  const handleChangeSearch = (value: string) => {
    setSearchInput(value)

    if (TypeGuards.isNil(debounceTest)) {
      onChangeSearch?.(value)
    } else {
      if (setSearchTimeout.current) {
        clearTimeout(setSearchTimeout.current)
      }

      setSearchTimeout.current = setTimeout(() => {
        onChangeSearch(value)
      }, debounceTest ?? 0)
    }
  }

  const handleClear = () => {
    setSearchInput('')
    onChangeSearch?.('')
  }

  return <>
    <TextInput
      value={searchInput}
      onChangeText={(value) => {
        onTypingChange?.(true)
        handleChangeSearch(value)
      }}
      onEndEditing={() => {
        onTypingChange?.(false)
        setLoading(false)
      }}
      placeholder={placeholder}
      debugName={`Search ${debugName}`}
      rightIcon={{
        name: 'x' as IconPlaceholder,
        onPress: handleClear,
      }}
      leftIcon={{
        name: 'search' as IconPlaceholder,
      }}
    />

    <List<AutocompleteProps<any>['options']>
      data={searchable ? filteredOptions : options}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      styles={listStyles}
      keyExtractor={(i) => i.value}
      renderItem={renderListItem}
      fakeEmpty={loading}
      separators
      {...listProps}
      placeholder={{
        loading: loading,
      }}
    />
  </>
}

export * from './styles'
export * from './types'

Autocomplete.defaultProps = defaultProps
