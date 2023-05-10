import { IconPlaceholder,
  getNestedStylesByKey,
  useDefaultComponentStyle,
  TypeGuards,
  useNestedStylesByKey
} from '@codeleap/common'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { List } from '../List'
import { TextInput } from '../TextInput'
import { SelectPresets } from './styles'
import { CustomSelectProps } from './types'
import { ModalManager } from '../../utils'
import { Button } from  '../Button'
export * from './styles'

export * from './styles'
export const Select = <T extends string|number = string>(selectProps:CustomSelectProps<T>) => {
  const {
    value,
    onValueChange,
    label,
    styles = {},
    options,
    style,
    variants,
    description,
    renderItem,
    closeOnSelect = true,
    listProps,
    debugName,
    placeholder = 'Select',
    arrowIconName = 'selectArrow',
    clearIconName = 'close',
    clearable = false,
    selectedIcon = 'selectMarker',
    inputProps = {},
    hideInput = false,
    itemProps = {},
    ...drawerProps
  } = selectProps

  const variantStyles = useDefaultComponentStyle<'u:Select', typeof SelectPresets>('u:Select', {
    transform: StyleSheet.flatten,
    rootElement: 'inputWrapper',
    styles,
    variants,
  })

  const itemStyles = useNestedStylesByKey('item', variantStyles)

  const listStyles = useNestedStylesByKey('list', variantStyles)

  const inputStyles = useNestedStylesByKey('input', variantStyles)


  const close = () => drawerProps?.toggle?.()

  const select = (value) => {

    onValueChange(value)
    if (closeOnSelect) {
      close?.()
    }
  }

  const selectedLabel:string = useMemo(() => {
    const current = options.find(o => o.value === value)

    const display = current?.label ?? placeholder

    return TypeGuards.isString(display) ? display : ''
  }, [value, placeholder, options])
  const Item = renderItem || Button

  const renderListItem = useCallback(({ item }) => {

    return <Item
      debugName={`${debugName} item ${item.value}`}
      selected={value === item.value}
      text={item.label}
      item={item}
      onPress={() => select(item.value)}
      // @ts-ignore 
      icon={selectedIcon}
      // @ts-ignore 
      rightIcon={selectedIcon}
      styles={itemStyles}
      {...itemProps}
    />
  }, [value, select])
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
          debugName={`${debugName} select input`}
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
      <List<CustomSelectProps<any>['options']>
        data={options}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        styles={listStyles}
        keyExtractor={(i) => i.value}
        renderItem={renderListItem}
        
        separators
        {...listProps}
      />
    </ModalManager.Modal>

  </>
}

export * from './styles'
export * from './types'
