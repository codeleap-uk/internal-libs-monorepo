import React from 'react'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { TypeGuards } from '@codeleap/types'
import { View } from '../View'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { RadioGroupProps, RadioOptionProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { useInputBasePartialStyles } from '../InputBase/useInputBasePartialStyles'
import { useInputBase } from '../InputBase/useInputBase'
import { SelectableField, fields } from '@codeleap/form'

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

  const partialStyles = useInputBasePartialStyles(
    styles,
    ['optionLabel', 'optionWrapper', 'optionIndicator', 'optionIndicatorInner'],
    {
      selectedDisabled: isDisabled && selected,
      disabled: isDisabled,
      selected,
    }
  )

  const label = TypeGuards.isString(item.label) ? <Text
    style={partialStyles.optionLabel}
    text={item.label}
  /> : item.label

  return <>
    <Touchable
      debugName={`${debugName} option ${item.value}`}
      style={partialStyles.optionWrapper}
      rippleDisabled
      onPress={onSelect}
      disabled={isDisabled}
    >
      {reverseOrder ? (
        <>
          {label}
          <View style={partialStyles.optionIndicator}>
            <View style={partialStyles.optionIndicatorInner} />
          </View>
        </>
      ) : (
        <>
          <View style={partialStyles.optionIndicator}>
            <View style={partialStyles.optionIndicatorInner} />
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
    disabled,
    debugName,
    radioOnRight,
    style,
    field,
  } = others

  const styles = useStylesFor(RadioGroup.styleRegistryName, style)

  const {
    fieldHandle,
    wrapperRef,
  } = useInputBase(field as SelectableField<T, any>, fields.selectable as () => SelectableField<T, any>)

  const { items } = field.getProps()

  // @ts-expect-error icss type
  const _radioOnRight = radioOnRight ?? styles?.__props?.radioOnRight

  const hasValue = !TypeGuards.isNil(fieldHandle?.value)

  return <InputBase
    {...inputBaseProps}
    ref={wrapperRef}
    disabled={disabled}
    style={styles}
    debugName={debugName}
    hasValue={hasValue}
  >
    {items?.map((item, idx) => (
      <Option
        debugName={debugName}
        item={item}
        key={idx}
        disabled={disabled}
        styles={styles}
        selected={fieldHandle?.value === item.value}
        onSelect={() => fieldHandle.setValue(item.value)}
        separator={idx < items?.length - 1}
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

RadioGroup.defaultProps = {} as Partial<RadioGroupProps<string>>

MobileStyleRegistry.registerComponent(RadioGroup)
