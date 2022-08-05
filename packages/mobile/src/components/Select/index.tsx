import { IconPlaceholder,
  getNestedStylesByKey,
  useDefaultComponentStyle,
  TypeGuards } from '@codeleap/common'
import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { List } from '../List'
import { Text } from '../Text'
import { TextInput } from '../TextInput'
import { Touchable } from '../Touchable'
import { SelectStyles } from './styles'
import { CustomSelectProps } from './types'
import { ModalManager } from '../../utils'
import { Icon } from '../Icon'

export const SelectItem = ({ item, icon = null, isSelected, styles, onPress }) => {
  return <Touchable style={[
    styles.itemWrapper,
    isSelected && styles['itemWrapper:selected'],
  ]} onPress={onPress} debugName={`Select ${item.value}`}>
    <Text text={item.label} style={[
      styles.itemText,
      isSelected && styles['itemText:selected'],
    ]}/>
    {icon ? <Icon name={icon} style={[styles?.itemIcon, isSelected && styles?.['itemIcon:selected']]}/> : null}
  </Touchable>
}

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
    renderItem,
    closeOnSelect = true,
    listProps,
    placeholder = 'Select',
    arrowIconName = 'selectArrow',
    selectedIcon = 'selectMarker',
    inputProps = {},
    hideInput = false,
    ...drawerProps
  } = selectProps

  const variantStyles = useDefaultComponentStyle<'u:Select', typeof SelectStyles>('u:Select', {
    transform: StyleSheet.flatten,
    rootElement: 'inputWrapper',
    styles,
    variants,
  })

  const inputStyles = useMemo(
    () => getNestedStylesByKey('input', variantStyles),
    [variantStyles],
  )

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

  const Item = renderItem || SelectItem

  const renderListItem = ({ item }) => {
    return <Item
      isSelected={value === item.value}
      item={item}
      onPress={() => select(item.value)}
      icon={selectedIcon}
      styles={variantStyles}
    />
  }
  return <>
    {
      !hideInput && (
        <TextInput
          caretHidden
          value={selectedLabel}
          rightIcon={{
            icon: arrowIconName as IconPlaceholder,
          }}
          editable={false}
          touchableWrapper
          onPress={close}
          wrapperProps={{
            debugName: 'Select',

          }}
          pointerEvents={'none'}
          label={label}
          debugName={'Select input'}
          styles={inputStyles}
          style={style}
          {...inputProps}
        />
      )
    }

    <ModalManager.Drawer scroll={false} title={label} {...drawerProps} styles={variantStyles}>
      <List<CustomSelectProps<any>['options']>
        data={options}
        style={variantStyles.list}
        contentContainerStyle={variantStyles.listContent}
        keyExtractor={(i) => i.value}
        renderItem={renderListItem}
        {...listProps}
      />
    </ModalManager.Drawer>

  </>
}

export * from './styles'
export * from './types'
