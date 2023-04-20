import { IconPlaceholder,
  getNestedStylesByKey,
  useDefaultComponentStyle,
  TypeGuards } from '@codeleap/common'
import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { List } from '../List'
import { TextInput } from '../TextInput'
import { MultiSelectProps } from './types'
import { ModalManager } from '../../utils'
import { MultiSelectPresets } from './styles'
import { SelectItem } from '../Select'

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
    ...drawerProps
  } = selectProps

  const variantStyles = useDefaultComponentStyle<'u:MultiSelect', typeof MultiSelectPresets>('u:MultiSelect', {
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

  const Item = renderItem || SelectItem

  const renderListItem = ({ item }) => {
    return <Item
      isSelected={value.includes(item.value)}
      item={item}
      onPress={() => select(item.value)}
      styles={variantStyles}
      icon={selectedIcon as IconPlaceholder}
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
          caretHidden
          value={selectedLabel}
          rightIcon={{
            icon: inputIcon as IconPlaceholder,
            onPress: onPressInputIcon,
          }}
          editable={false}
          wrapperProps={{
            debugName: 'Select',
            onPress: close,
          }}
          pointerEvents={'none'}
          label={label}
          debugName={'Select input'}
          styles={inputStyles}
          style={style}
          validate={validate}
          {...inputProps}
        />
      )
    }

    <ModalManager.Modal title={label} {...drawerProps} styles={variantStyles} id={null}>
      <List<MultiSelectProps<any>['options']>
        data={options}
        styles={getNestedStylesByKey('list', variantStyles)}
        keyExtractor={(i) => i.value}
        separators
        keyboardAware={{
          enabled: false,
        }}
        renderItem={renderListItem}
        {...listProps}
      />
    </ModalManager.Modal>

  </>
}

export * from './styles'
export * from './types'

