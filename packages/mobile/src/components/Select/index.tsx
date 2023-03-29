import { IconPlaceholder,
  getNestedStylesByKey,
  useDefaultComponentStyle,
  TypeGuards } from '@codeleap/common'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { List } from '../List'
import { Text } from '../Text'
import { TextInput } from '../TextInput'
import { Touchable } from '../Touchable'
import { SelectPresets } from './styles'
import { CustomSelectProps } from './types'
import { ModalManager } from '../../utils'
import { Icon } from '../Icon'
export * from './styles'

export const SelectItem = ({
  item,
  icon = null,
  isSelected,
  styles,
  onPress,
  iconProps = {},
  textProps = {},
  ...touchableProps
}) => {
  return <Touchable
    style={[
      styles.itemWrapper,
      isSelected && styles['itemWrapper:selected'],
    ]}
    onPress={onPress}
    debugName={`Select ${item.value}`}
    debounce={null}
    {...touchableProps}
  >
    <Text
      text={item.label}
      style={[
        styles.itemText,
        isSelected && styles['itemText:selected'],
      ]}
      {...textProps}
    />
    {icon ? <Icon
      name={icon}
      style={[styles?.itemIcon, isSelected && styles?.['itemIcon:selected']]}
      {...iconProps}
    /> : null}
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

  const renderListItem = useCallback(({ item }) => {

    return <Item
      isSelected={value === item.value}
      item={item}
      onPress={() => select(item.value)}
      icon={selectedIcon}
      styles={variantStyles}
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
          caretHidden
          value={selectedLabel}
          rightIcon={{
            icon: inputIcon as IconPlaceholder,
            onPress: onPressInputIcon,
            noFeedback: true,
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

    <ModalManager.Modal
      title={label}
      keyboardAware={{

        enabled: false,
      }}
      {...drawerProps}
      styles={variantStyles}
      id={null}
    >
      <List<CustomSelectProps<any>['options']>
        data={options}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        styles={getNestedStylesByKey('list', variantStyles)}
        keyExtractor={(i) => i.value}
        renderItem={renderListItem}
        keyboardAware={{
          enabled: false,
          enableOnAndroid: false,
        }}
        separators
        {...listProps}
      />
    </ModalManager.Modal>

  </>
}

export * from './styles'
export * from './types'
