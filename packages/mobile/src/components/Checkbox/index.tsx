import React from 'react'
import { View } from '../View'
import { InputBase, InputBaseDefaultOrder, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Touchable } from '../Touchable'
import { Icon } from '../Icon'
import { CheckboxProps } from './types'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'

export * from './styles'
export * from './types'

const reversedOrder = [...InputBaseDefaultOrder].reverse()

const defaultProps: Partial<CheckboxProps> = {
  checkIcon: 'check' as AppIcon,
}

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
    value,
    disabled,
    debugName,
    onValueChange,
    checkboxOnLeft,
    checkIcon,
  } = others

  const styles = MobileStyleRegistry.current.styleFor(Checkbox.styleRegistryName, style)

  const boxAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['box:unchecked', 'box:disabled', 'box:checked', 'box:disabled-checked', 'box:disabled-unchecked'],
    transition: styles['box:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? styles['box:disabled-checked'] : styles['box:disabled-unchecked']
      }
      const style = value ? styles['box:checked'] : styles['box:unchecked']

      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [value, disabled],
  })

  const checkmarkWrapperAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['checkmarkWrapper:unchecked', 'checkmarkWrapper:disabled', 'checkmarkWrapper:checked', 'checkmarkWrapper:disabled-unchecked', 'checkmarkWrapper:disabled-checked'],
    transition: styles['checkmarkWrapper:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? styles['checkmarkWrapper:disabled-checked'] : styles['checkmarkWrapper:disabled-unchecked']
      }
      const style = value ? styles['checkmarkWrapper:checked'] : styles['checkmarkWrapper:unchecked']
      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [value, disabled],
  })

  // @ts-expect-error
  const _checkboxOnLeft = checkboxOnLeft ?? styles.__props?.checkboxOnLeft

  return <InputBase
    {...inputBaseProps}
    debugName={debugName}
    wrapper={Touchable}
    style={styles}
    wrapperProps={{
      onPress: () => {
        onValueChange(!value)
      },
      disabled,
      rippleDisabled: true,
    }}
    order={_checkboxOnLeft ? reversedOrder : InputBaseDefaultOrder}
  >
    <View
      animated
      style={[
        styles.box,
        disabled && styles['box:disabled'],
        boxAnimation,
      ]}
    >
      <View
        animated
        style={[
          styles.checkmarkWrapper,
          disabled && styles['checkmarkWrapper:disabled'],
          checkmarkWrapperAnimation,
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

Checkbox.defaultProps = defaultProps

MobileStyleRegistry.registerComponent(Checkbox)
