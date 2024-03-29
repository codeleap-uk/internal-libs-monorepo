/** @jsx jsx */
import { jsx } from '@emotion/react'

import React, { ReactNode } from 'react'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import {
  ComponentVariants,
  FormTypes,
  StylesOf,
  TypeGuards,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { View } from '../View'
import { RadioInputComposition, RadioInputPresets } from './styles'
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
} & ComponentVariants<typeof RadioInputPresets>

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
    css={[
      styles.optionLabel,
      getStyle('optionLabel'),
    ]}
    text={item.label}
  /> : item.label

  return <React.Fragment>
    <Touchable
      debugName={`${debugName} option ${item.value}`}
      css={[
        styles.optionWrapper,
        getStyle('optionWrapper'),
      ]}
      onPress={onSelect}
      disabled={isDisabled}
    >
      <View
        css={[
          styles.optionIndicator,
          getStyle('optionIndicator'),
        ]}

      >
        <View
          css={[
            styles.optionIndicatorInner,
            getStyle('optionIndicatorInner'),
          ]}
        />
      </View>
      {label}

    </Touchable>
    {separator && <View style={styles.optionSeparator} />}
  </React.Fragment>
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
    responsiveVariants = {},
    variants = [],
    styles,
    disabled,
    debugName,
  } = others

  const variantStyles = useDefaultComponentStyle<'u:RadioInput', typeof RadioInputPresets>('u:RadioInput', {
    responsiveVariants,
    variants,
    styles,
  })

  return <InputBase
    {...inputBaseProps}
    disabled={disabled}
    styles={{
      ...variantStyles,
      innerWrapper: [
        variantStyles.innerWrapper,
      ],
    }}
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
