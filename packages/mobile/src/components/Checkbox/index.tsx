import React from 'react'
import { View } from '../View'
import { InputBase, InputBaseDefaultOrder, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Touchable } from '../Touchable'
import { Icon } from '../Icon'
import { CheckboxProps } from './types'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { useInputBase } from '../InputBase/useInputBase'
import { fields } from '@codeleap/form'

export * from './styles'
export * from './types'

const reversedOrder = [...InputBaseDefaultOrder].reverse()

export const Checkbox = (props: CheckboxProps) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps({
    ...Checkbox.defaultProps,
    ...props,
  })

  const {
    style,
    disabled,
    debugName,
    checkboxOnLeft,
    checkIcon,
    field,
    forceError,
  } = others

  const styles = useStylesFor(Checkbox.styleRegistryName, style)

  const {
    fieldHandle,
    validation,
    wrapperRef,
  } = useInputBase(field, fields.boolean)

  const boxAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['box:unchecked', 'box:disabled', 'box:checked', 'box:disabled-checked', 'box:disabled-unchecked'],
    transition: styles['box:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = fieldHandle?.value ? styles['box:disabled-checked'] : styles['box:disabled-unchecked']
      }
      const style = fieldHandle?.value ? styles['box:checked'] : styles['box:unchecked']

      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [fieldHandle?.value, disabled],
  })

  const checkmarkWrapperAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['checkmarkWrapper:unchecked', 'checkmarkWrapper:disabled', 'checkmarkWrapper:checked', 'checkmarkWrapper:disabled-unchecked', 'checkmarkWrapper:disabled-checked'],
    transition: styles['checkmarkWrapper:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = fieldHandle?.value ? styles['checkmarkWrapper:disabled-checked'] : styles['checkmarkWrapper:disabled-unchecked']
      }
      const style = fieldHandle?.value ? styles['checkmarkWrapper:checked'] : styles['checkmarkWrapper:unchecked']
      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [fieldHandle?.value, disabled],
  })

  // @ts-expect-error
  const _checkboxOnLeft = checkboxOnLeft ?? styles.__props?.checkboxOnLeft

  const hasError = validation.showError || forceError

  return <InputBase
    {...inputBaseProps}
    ref={wrapperRef}
    error={hasError ? validation.message || forceError : null}
    debugName={debugName}
    wrapper={Touchable}
    style={styles}
    wrapperProps={{
      onPress: () => {
        fieldHandle.setValue(!fieldHandle?.value)
      },
      disabled,
      rippleDisabled: true,
    }}
    order={_checkboxOnLeft ? reversedOrder : InputBaseDefaultOrder}
  >
    <View
      animated
      animatedStyle={boxAnimation}
      style={[
        styles.box,
        disabled && styles['box:disabled'],
      ]}
    >
      <View
        animated
        animatedStyle={checkmarkWrapperAnimation}
        style={[
          styles.checkmarkWrapper,
          disabled && styles['checkmarkWrapper:disabled'],
        ]}
      >
        <Icon
          name={checkIcon}
          style={[styles.checkmark, disabled && styles['checkmark:disabled']]}
        />
      </View>
    </View>
  </InputBase>
}

Checkbox.styleRegistryName = 'Checkbox'
Checkbox.rootElement = 'wrapper'
Checkbox.elements = [...InputBase.elements, 'checkmark', 'box', '__props']

Checkbox.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Checkbox as (props: StyledComponentProps<CheckboxProps, typeof styles>) => IJSX
}

Checkbox.defaultProps = {
  checkIcon: 'check' as AppIcon,
} as Partial<CheckboxProps>

MobileStyleRegistry.registerComponent(Checkbox)
