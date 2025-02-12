/* eslint-disable max-lines */
import { Option, Options, TypeGuards } from '@codeleap/types'
import {
  onMount,
  onUpdate,
  usePrevious,
  useSearch,
  useConditionalState,
} from '@codeleap/hooks'
import React, { useCallback, useMemo } from 'react'
import { List } from '../List'
import { TextInput } from '../TextInput'
import { SelectProps, ValueBoundSelectProps } from './types'
import { ModalManager } from '../../utils'
import { Button } from '../Button'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import Modal from '../Modal'
import { MobileStyleRegistry } from '../../Registry'
import { SearchInput } from '../SearchInput'
import { useStylesFor } from '../../hooks'
import { SelectableField, fields, useField } from '@codeleap/form'

export * from './styles'
export * from './types'

const defaultFilterFunction = (search: string, options: Options<any>) => {
  return options.filter((option) => {
    if (TypeGuards.isString(option.label)) {
      return option.label.toLowerCase().includes(search.toLowerCase())
    }

    return option.label === search
  })
}

const defaultGetLabel = (option) => {
  if (TypeGuards.isArray(option)) {
    if (option?.length === 0) return null

    const labels = option?.map(option => option?.label)?.filter(value => !!value)

    return labels?.join(', ')
  } else {
    if (!option) return null
    return option?.label
  }
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

export const Select = <T extends string | number = string, Multi extends boolean = false>(selectProps: SelectProps<T, Multi>) => {
  const allProps = {
    ...Select.defaultProps,
    ...selectProps,
    ...selectProps?.field?.getProps(),
  }

  const {
    label,
    options = [],
    style,
    description,
    renderItem: Item,
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
    ListComponent,
    onLoadOptionsError,
    loadOptionsOnMount = defaultOptions.length === 0,
    loadOptionsOnOpen,
    filterItems,
    getLabel,
    searchInputProps,
    outerInputComponent,
    disabled,
    field,
    ...modalProps
  } = allProps

  const fieldHandle = useField(field, [], fields.selectable as () => SelectableField<T, any>)

  const value = fieldHandle.value

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

  const [visible, toggle] = useConditionalState(_visible, _toggle, { initialValue: false, isBooleanToggle: true })

  const currentValueLabel = useMemo(() => {
    const _options = (multiple ? labelOptions : labelOptions?.[0]) as Multi extends true ? Options<T> : Option<T>

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

  const styles = useStylesFor(Select.styleRegistryName, style)

  const compositionStyles = useCompositionStyles(['item', 'list', 'input', 'searchInput'], styles)

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

    fieldHandle.setValue(newValue)

    if (isValueArray) {
      if (removedIndex !== null) {
        const newOptions = [...labelOptions]
        newOptions.splice(removedIndex, 1)
        setLabelOptions(newOptions)
      } else {
        const newLabels = [...labelOptions, newOption]
        setLabelOptions(newLabels)
      }
    } else {
      setLabelOptions([newOption])
    }

    if (closeOnSelect) {
      close?.()
    }
  }, [isValueArray, (isValueArray ? value : [value]), limit, multiple, labelOptions, currentOptions])

  const renderListItem = useCallback(({ item, index }) => {
    let selected = false

    if (multiple && isValueArray) {
      selected = value?.includes(item.value)
    } else {
      selected = value === item.value
    }

    return (
      <Item
        debugName={`${debugName} item ${item.value}`}
        selected={selected}
        text={item.label}
        item={item}
        onPress={() => select(item.value)}
        // @ts-ignore
        icon={selectedIcon}
        // @ts-ignore
        rightIcon={selectedIcon}
        style={compositionStyles?.item}
        index={index}
        {...itemProps}
      />
    )
  }, [value, select, multiple])

  const isEmpty = TypeGuards.isNil(value)
  const showClearIcon = !isEmpty && clearable

  const inputIcon = showClearIcon ? clearIconName : arrowIconName

  const onPressInputIcon = () => {
    if (showClearIcon) {
      fieldHandle.setValue(null)
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
    style={compositionStyles?.searchInput}
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
          style={compositionStyles?.input}
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
      <ListComponent
        data={searchable ? filteredOptions : options}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        style={compositionStyles?.list}
        keyExtractor={(i: { value: any }) => i.value}
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

Select.defaultProps = {
  getLabel: defaultGetLabel,
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
  filterItems: defaultFilterFunction,
  renderItem: Button,
  ListComponent: List,
} as Partial<SelectProps<any, boolean>>

MobileStyleRegistry.registerComponent(Select)
