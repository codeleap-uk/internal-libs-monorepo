import { IconPlaceholder,
  getNestedStylesByKey,
  useDefaultComponentStyle,
  TypeGuards, 
  useNestedStylesByKey} from '@codeleap/common'
import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { List } from '../List'
import { TextInput } from '../TextInput'
import { MultiSelectProps } from './types'
import { ModalManager } from '../../utils'
import { MultiSelectPresets } from './styles'
import { Button } from '../Button'

export * from './styles'
export const MultiSelect = <T extends string|number = string>(selectProps:MultiSelectProps<T>) => {
  const {
    value,
    onValueChange,
    label,
    styles = {},
    options,
    style,
    variants,
    hideInput = false,
    renderItem,
    listProps,
    placeholder = 'Select',
    arrowIconName = 'selectArrow',
    selectedIcon = 'multiSelectMarker',
    inputProps = {},
    clearable = false,
    clearIconName = 'close',
    limit = null,
    validate = null,
    itemProps = {},
    debugName,
    description,
    ...drawerProps
  } = selectProps

  const variantStyles = useDefaultComponentStyle<'u:MultiSelect', typeof MultiSelectPresets>('u:MultiSelect', {
    transform: StyleSheet.flatten,
    rootElement: 'inputWrapper',
    styles,
    variants,
  })

  const inputStyles = useNestedStylesByKey('input', variantStyles)

  const itemStyles = useNestedStylesByKey('item', variantStyles)

  const listStyles = useNestedStylesByKey('list', variantStyles)

  const close = () => drawerProps?.toggle?.()

  const select = (itemValue) => {
    const newVal = [...value]

    if (newVal.includes(itemValue)) {
      newVal.splice(newVal.indexOf(itemValue), 1)
    } else {
      if (TypeGuards.isNumber(limit) && newVal.length >= limit) {
        return
      }
      newVal.push(itemValue)
    }
    onValueChange(newVal)

  }

  const selectedLabel:string = useMemo(() => {
    const current = options.filter(o => value.includes(o.value)).map(o => o.label)

    const display = current?.join(', ') ?? placeholder

    return TypeGuards.isString(display) ? display : ''
  }, [value, placeholder, options])

  const Item = renderItem || Button

  const renderListItem = ({ item }) => {
    return <Item
      debugName={`${debugName} item ${item.value}`}
      selected={value.includes(item.value)}
      text={item.label}
      item={item}
      onPress={() => select(item.value)}
      
      rightIcon={selectedIcon as IconPlaceholder}
      icon={selectedIcon as IconPlaceholder}
      styles={itemStyles}
      {...itemProps}

    />
  }

  const isEmpty = value.length === 0
  const showClearIcon = !isEmpty && clearable
  const inputIcon = showClearIcon ? clearIconName : arrowIconName

  const onPressInputIcon = () => {
    if (showClearIcon) {
      onValueChange([])
    } else {
      close?.()
    }

  }
  return <>
    {
      !hideInput && (
        <TextInput
          
          value={selectedLabel}
          rightIcon={{
            icon: inputIcon as IconPlaceholder,
            onPress: onPressInputIcon,
          }}
          onPress={close}
          
          label={label}
          debugName={`${debugName} multiselect input`}
          styles={inputStyles}
          style={style}
          {...inputProps}
        />
      )
    }

    <ModalManager.Modal 
      title={label} 
      description={description}
      {...drawerProps} 
      debugName={`${debugName} modal`} 
      styles={variantStyles} 
      id={null}
    >
      <List<MultiSelectProps<any>['options']>
        data={options}
        styles={listStyles}
        keyExtractor={(i) => i.value}
        separators
        renderItem={renderListItem}
        {...listProps}
      />
    </ModalManager.Modal>

  </>
}

export * from './styles'
export * from './types'

