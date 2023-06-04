import React from 'react'
import { ReactNode, ComponentPropsWithoutRef } from 'react'

import { Text } from '../Text'
import { Touchable } from '../Touchable'
import {
  ComponentVariants,
  FormTypes,
  getNestedStylesByKey,
  StylesOf,
  TypeGuards,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { View } from '../View'
import { RadioInputComposition, RadioInputPresets } from './styles'
import { InputLabel } from '../InputLabel'
import { StyleSheet } from 'react-native'
import { InputBase, InputBaseProps, selectInputBaseProps } from '../InputBase'
export * from './styles'

type WrapperProps = InputBaseProps

type RadioOption<T> = FormTypes.Options<T>[number] & {
  disabled?: boolean
}
export type RadioGroupProps<T extends string|number> = WrapperProps & {
  options: RadioOption<T>[]
  value: T
  onValueChange(value: T): void
  label: ReactNode
  styles?: StylesOf<RadioInputComposition>
  variants?: ComponentVariants<typeof RadioInputPresets>['variants']
}

type OptionProps<T extends string|number> = {
  item: RadioOption<T>
  selected: boolean
  onSelect(): void
  styles?: StylesOf<RadioInputComposition>
  debugName?: string
  disabled?: boolean
  separator?: boolean
}

const Option = <T extends string|number>(props: OptionProps<T>) => {
  const {
    debugName,
    item,
    disabled,
    styles,
    selected,
    onSelect,
    separator = false,
  } = props

  const isDisabled = disabled || item.disabled

  const getStyle = (key) => {
    if (isDisabled && selected) {
      return styles[`${key}:selectedDisabled`]
    }
    if (isDisabled) {
      return styles[`${key}:disabled`]
    }
    if (selected) {
      return styles[`${key}:selected`]
    }
    return styles[key]
  }

  const label = TypeGuards.isString(item.label) ? <Text
    style={[
      styles.optionLabel,
      getStyle('optionLabel'),
    ]}
    text={item.label}
  /> : item.label

  return <>
    <Touchable
      debugName={`${debugName} option ${item.value}`}
      style={[
        styles.optionWrapper,
        getStyle('optionWrapper'),
      ]}
      rippleDisabled
      onPress={onSelect}
      disabled={isDisabled}
    >
      <View
        style={[
          styles.optionIndicator,
          getStyle('optionIndicator'),
        ]}

      >
        <View
          style={[
            styles.optionIndicatorInner,
            getStyle('optionIndicatorInner'),
          ]}
        />
      </View>
      {label}

    </Touchable>
    {separator && <View style={styles.optionSeparator} />}
  </>
}

export const RadioGroup = <T extends string|number>(
  props: RadioGroupProps<T>,
) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps(props)

  const {
    options,
    value,
    onValueChange,
    variants,
    styles,
    disabled,
    debugName,
  } = others

  const variantStyles = useDefaultComponentStyle<'u:RadioInput', typeof RadioInputPresets>('u:RadioInput', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  return <InputBase
    {...inputBaseProps}
    disabled={disabled}
    styles={variantStyles}
    debugName={debugName}
  >
    {options?.map((item, idx) => (
      <Option
        debugName={debugName}
        item={item}
        key={idx}
        disabled={disabled}
        styles={variantStyles}
        selected={value === item.value}
        onSelect={() => onValueChange(item.value)}
        separator={idx < options.length - 1}
      />
    ))}
  </InputBase>

}
