/** @jsx jsx */
import { jsx } from '@emotion/react'
import React from 'react'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { TypeGuards } from '@codeleap/common'
import { View } from '../View'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { RadioOptionProps, RadioInputProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'

const Option = <T extends string | number>(props: RadioOptionProps<T>) => {

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

  return (
    <React.Fragment>
      {/* @ts-expect-error @verify */}
      <Touchable
        debugName={`${debugName} option ${item.value}`}
        style={[
          styles.optionWrapper,
          getStyle('optionWrapper'),
        ]}
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
    </React.Fragment>
  )
}

export const RadioInput = <T extends string | number>(props: RadioInputProps<T>) => {

  const {
    inputBaseProps,
    others: radioInputProps,
  } = selectInputBaseProps({
    ...RadioInput.defaultProps,
    ...props,
  })

  const {
    options,
    value,
    onValueChange,
    style,
    disabled,
    debugName,
  } = radioInputProps

  const styles = useStylesFor(RadioInput.styleRegistryName, style)

  return (
    <InputBase
      {...inputBaseProps}
      disabled={disabled}
      style={{
        ...styles,
        innerWrapper: [
          styles.innerWrapper,
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
          styles={styles}
          selected={value === item.value}
          onSelect={() => onValueChange(item.value)}
          separator={idx < options.length - 1}
        />
      ))}
    </InputBase>
  )
}

RadioInput.styleRegistryName = 'RadioInput'

RadioInput.elements = [
  'wrapper',
  'innerWrapper',
  'label',
  'errorMessage',
  'description',
  'labelRow',
  'option',
]

RadioInput.rootElement = 'wrapper'

RadioInput.withVariantTypes = <S extends AnyRecord, T extends string | number>(styles: S) => {
  return RadioInput as (props: StyledComponentProps<RadioInputProps<T>, typeof styles>) => IJSX
}

RadioInput.defaultProps = {} as Partial<RadioInputProps<string | number>>

WebStyleRegistry.registerComponent(RadioInput)

export * from './styles'
export * from './types'
