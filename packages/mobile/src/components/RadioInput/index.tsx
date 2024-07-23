import React from 'react'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { TypeGuards } from '@codeleap/common'
import { View } from '../View'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { RadioGroupProps, RadioOptionProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

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
    reverseOrder,
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
      {reverseOrder ? (
        <>
          {label}
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
        </>
      ) : (
        <>
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
        </>
      )}

    </Touchable>
    {separator ? <View style={styles.optionSeparator} /> : null}
  </>
}

export const RadioGroup = <T extends string | number>(props: RadioGroupProps<T>) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps({
    ...RadioGroup.defaultProps,
    ...props,
  })

  const {
    options,
    value,
    onValueChange,
    disabled,
    debugName,
    radioOnRight,
    style,
  } = others

  const styles = useStylesFor(RadioGroup.styleRegistryName, style)

  // @ts-expect-error icss type
  const _radioOnRight = radioOnRight ?? styles?.__props?.radioOnRight

  return <InputBase
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
        selected={value === item.value}
        onSelect={() => onValueChange(item.value)}
        separator={idx < options.length - 1}
        reverseOrder={_radioOnRight}
      />
    ))}
  </InputBase>
}

RadioGroup.styleRegistryName = 'RadioGroup'
RadioGroup.elements = [...InputBase.elements, 'option', '__props']
RadioGroup.rootElement = 'wrapper'

RadioGroup.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return RadioGroup as (<T extends string | number>(props: StyledComponentProps<RadioGroupProps<T>, typeof styles>) => IJSX)
}

RadioGroup.defaultProps = {} as Partial<RadioGroupProps<string | number>>

MobileStyleRegistry.registerComponent(RadioGroup)
