import React from 'react'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { TypeGuards } from '@codeleap/types'
import { View } from '../View'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { RadioOptionProps, RadioInputProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
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
  } = props

  const isDisabled = disabled || item?.disabled

  const partialStyles = useInputBasePartialStyles(
    styles,
    ['optionLabel', 'optionWrapper', 'optionIndicator', 'optionIndicatorInner'],
    {
      selectedDisabled: isDisabled && selected,
      disabled: isDisabled,
      selected,
    }
  )

  return (
    <React.Fragment>
      <Touchable
        debugName={`${debugName} option ${item.value}`}
        style={partialStyles.optionWrapper}
        onPress={onSelect}
        disabled={isDisabled}
      >
        <View style={partialStyles.optionIndicator}>
          <View style={partialStyles.optionIndicatorInner} />
        </View>

        {TypeGuards.isString(item.label) ? <Text style={partialStyles.optionLabel} text={item.label} /> : item.label}
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
    field,
    options,
    value,
    onValueChange,
    style,
    disabled,
    debugName,
  } = radioInputProps

  const styles = useStylesFor(RadioInput.styleRegistryName, style)

  const {
    wrapperRef,
    inputValue,
    onInputValueChange,
  } = useInputBase(
    // @ts-ignore
    field as SelectableField<T, any>,
    fields.selectable as () => SelectableField<T, any>,
    { value, onValueChange }
  )

  return (
    <InputBase
      {...inputBaseProps}
      ref={wrapperRef}
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
          selected={inputValue === item.value}
          onSelect={() => onInputValueChange(item.value)}
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
