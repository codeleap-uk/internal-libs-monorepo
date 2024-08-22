import React from 'react'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { TypeGuards } from '@codeleap/common'
import { View } from '../View'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { RadioOptionProps, RadioInputProps } from './types'
import { AnyRecord, IJSX, mergeStyles, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { RadioInputComposition } from './styles'

export * from './styles'
export * from './types'

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

  const isDisabled = disabled || item?.disabled

  const getStyle = (key: RadioInputComposition) => {
    let style = null

    if (isDisabled && selected) style = styles[`${key}:selectedDisabled`]
    else if (isDisabled) style = styles[`${key}:disabled`]
    else if (selected) style = styles[`${key}:selected`]

    return mergeStyles([styles[key], style])
  }

  return (
    <React.Fragment>
      <Touchable
        debugName={`${debugName} option ${item.value}`}
        style={getStyle('optionWrapper')}
        onPress={onSelect}
        disabled={isDisabled}
      >
        <View style={getStyle('optionIndicator')}>
          <View style={getStyle('optionIndicatorInner')} />
        </View>

        {TypeGuards.isString(item.label) ? <Text style={getStyle('optionLabel')} text={item.label} /> : item.label}
      </Touchable>

      {separator ? <View style={styles.optionSeparator} /> : null}
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
      style={styles}
      debugName={debugName}
    >
      {options?.map((item, idx) => (
        <Option
          debugName={debugName}
          item={item}
          key={idx}
          disabled={disabled}
          styles={styles}
          selected={value === item?.value}
          onSelect={() => onValueChange(item?.value)}
          separator={idx < options?.length - 1}
        />
      ))}
    </InputBase>
  )
}

RadioInput.styleRegistryName = 'RadioInput'
RadioInput.elements = [...InputBase.elements, 'option']
RadioInput.rootElement = 'wrapper'

RadioInput.withVariantTypes = <S extends AnyRecord, T extends string | number>(styles: S) => {
  return RadioInput as (props: StyledComponentProps<RadioInputProps<T>, typeof styles>) => IJSX
}

RadioInput.defaultProps = {} as Partial<RadioInputProps<string | number>>

WebStyleRegistry.registerComponent(RadioInput)
