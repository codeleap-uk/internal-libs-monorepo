/* eslint-disable max-lines */
import {
  useDefaultComponentStyle,
  TypeGuards,
  useNestedStylesByKey,
  FormTypes,
  onMount,
  onUpdate,
  usePrevious,
  useSearch,
  useBooleanToggle,
} from '@codeleap/common'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { List } from '../List'
import { SearchInput, TextInput } from '../TextInput'
import { SelectProps, ValueBoundSelectProps } from './types'
import { ModalManager } from '../../utils'
import { Button } from '../Button'
import { AnyRecord, AppIcon, getNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import Modal from '../Modal'
import { MobileStyleRegistry } from '../../Registry'

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

const OuterInput: ValueBoundSelectProps<any, boolean>['outerInputComponent'] = (props) => {
  const {
    currentValueLabel,
    debugName,
    clearIcon,
    label,
    toggle,
    style,
    placeholder,
    disabled = false,
    inputProps = {},
  } = props

  return <TextInput
    value={TypeGuards.isString(currentValueLabel) ? currentValueLabel : null}
    rightIcon={clearIcon}
    onPress={disabled ? null : () => toggle()}
    disabled={disabled}
    label={label}
    debugName={debugName}
    style={style}
    innerWrapperProps={{
      rippleDisabled: true,
    }}
    placeholder={placeholder as any}
    {...inputProps}
  />
}

const defaultProps: Partial<SelectProps<any, boolean>> = {
  getLabel(option) {
    if (TypeGuards.isArray(option)) {
      if (option.length === 0) return null

      return option.map(o => o.label).join(', ')

    } else {
      if (!option) return null
      return option?.label
    }
  },
  outerInputComponent: OuterInput,
  searchInputProps: {},
  arrowIconName: 'chevrons-up-down' as AppIcon,
  clearIconName: 'x' as AppIcon,
  placeholder: 'Select',
  clearable: false,
  selectedIcon: 'check' as AppIcon,
  hideInput: false,
  multiple: false,
  loadOptionsOnOpen: false,
  disabled: false,
}

export const Select = <T extends string | number = string, Multi extends boolean = false>(selectProps: SelectProps<T, Multi>) => {
  const allProps = {
    ...Select.defaultProps,
    ...selectProps,
  }

  const {
    value,
    onValueChange,
    label,
    options = [],
    style,
    description,
    renderItem,
    listProps,
    debugName,
    placeholder,
    arrowIconName,
    clearIconName,
    clearable,
    selectedIcon,
    inputProps = {},
    hideInput,
    itemProps = {},
    searchable,
    loadOptions,
    multiple,
    closeOnSelect = !multiple,
    limit = null,
    defaultOptions = options,
    visible: _visible,
    toggle: _toggle,
    ListHeaderComponent,
    ListComponent = List,
    onLoadOptionsError,
    loadOptionsOnMount = defaultOptions.length === 0,
    loadOptionsOnOpen,
    filterItems = defaultFilterFunction,
    getLabel,
    searchInputProps,
    outerInputComponent,
    disabled,
    ...modalProps
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

  const [visible, toggle] = TypeGuards.isBoolean(_visible) && !!_toggle ? [_visible, _toggle] : useBooleanToggle(false)

  const currentValueLabel = useMemo(() => {
    const _options = (multiple ? labelOptions : labelOptions?.[0]) as Multi extends true ? FormTypes.Options<T> : FormTypes.Options<T>[number]

    const label = getLabel(_options)

    return label
  }, [labelOptions])

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

  const styles = MobileStyleRegistry.current.styleFor(Select.styleRegistryName, style)

  const itemStyles = getNestedStylesByKey('item', styles)
  const listStyles = getNestedStylesByKey('list', styles)
  const inputStyles = getNestedStylesByKey('input', styles)
  const searchInputStyles = getNestedStylesByKey('searchInput', styles)

  const currentOptions = searchable ? filteredOptions : defaultOptions

  const close = () => toggle?.()

  const select = useCallback((selectedValue) => {
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
  }, [isValueArray, (isValueArray ? value : [value]), limit, multiple])

  const Item = renderItem || Button

  const renderListItem = useCallback(({ item, index }) => {
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
      icon={selectedIcon}
      // @ts-ignore
      rightIcon={selectedIcon}
      style={itemStyles}
      index={index}
      {...itemProps}
    />
  }, [value, select, multiple])

  const isEmpty = TypeGuards.isNil(value)
  const showClearIcon = !isEmpty && clearable

  const inputIcon = showClearIcon ? clearIconName : arrowIconName

  const onPressInputIcon = () => {
    if (showClearIcon) {
      onValueChange(null)
    } else {
      close?.()
    }

  }

  const searchHeader = searchable ? <SearchInput
    debugName={debugName}
    onTypingChange={(isTyping) => {
      if (searchable && !!loadOptions) {
        setLoading(isTyping)
      }
    }}
    debounce={!!loadOptions ? 800 : null}
    onSearchChange={onChangeSearch}
    styles={searchInputStyles}
    {...searchInputProps}
  /> : null

  const _ListHeaderComponent = useMemo(() => {
    if (ListHeaderComponent) {
      return <ListHeaderComponent
        searchComponent={searchHeader}
      />
    }

    return searchHeader

  }, [searchable, ListHeaderComponent])

  const Input = outerInputComponent

  return <>
    {
      !hideInput ? (
        // @ts-ignore
        <Input
          clearIcon={{
            icon: inputIcon as AppIcon,
            onPress: disabled ? null : onPressInputIcon,
          }}
          currentValueLabel={currentValueLabel}
          debugName={`${debugName} select input`}
          style={inputStyles}
          {...allProps}
          {...inputProps}
          visible={visible}
          toggle={toggle}
        />
      ) : null
    }

    <ModalManager.Modal
      title={label}
      description={description}
      {...modalProps}
      debugName={`${debugName} modal`}
      style={styles}
      id={null}
      visible={visible}
      toggle={toggle}
    >
      <ListComponent<SelectProps<any>['options']>
        data={searchable ? filteredOptions : options}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={listStyles}
        keyExtractor={(i) => i.value}
        renderItem={renderListItem}
        fakeEmpty={loading}
        separators
        keyboardAware={false}
        {...listProps}
        ListHeaderComponent={_ListHeaderComponent}
        placeholder={{
          loading,
        }}
      />
    </ModalManager.Modal>
  </>
}


Select.styleRegistryName = 'Select'
Select.elements = [...Modal.elements, 'input', 'list', 'item', 'searchInput']
Select.rootElement = 'inputWrapper'

Select.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Select as (<T extends string | number = string, Multi extends boolean = false>(props: StyledComponentProps<SelectProps<T, Multi>, typeof styles>) => IJSX)
}

Select.defaultProps = defaultProps

MobileStyleRegistry.registerComponent(Select)
