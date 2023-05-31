import * as React from 'react'
import {

  ComponentVariants,
  useDefaultComponentStyle,
  StylesOf,
  PropsOf,
} from '@codeleap/common'
import { ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import { View } from '../View'

import {
  CheckboxPresets,
  CheckboxComposition,
} from './styles'
import { InputBase, InputBaseDefaultOrder, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Touchable } from '../Touchable'
import { Icon } from '../Icon'

export * from './styles'

export type CheckboxProps = Pick<
  InputBaseProps,
  'debugName' | 'disabled' | 'label'
> & {
  variants?: ComponentVariants<typeof CheckboxPresets>['variants']
  styles?: StylesOf<CheckboxComposition>
  value: boolean
  onValueChange: (value: boolean) => void
  style?: PropsOf<typeof View>['style']
  checkboxOnLeft?: boolean
}

const reversedOrder = [...InputBaseDefaultOrder].reverse()

export const Checkbox = (props: CheckboxProps) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps(props)
  const {
    variants = [],
    style = {},
    styles = {},
    value,
    disabled,
    debugName,
    onValueChange,
    checkboxOnLeft,
  } = others

  const variantStyles = useDefaultComponentStyle<'u:Checkbox', typeof CheckboxPresets>('u:Checkbox', {
    variants,
    styles,
    rootElement: 'wrapper',
    transform: StyleSheet.flatten,
  })

  const boxAnimation = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: ['box:unchecked', 'box:disabled', 'box:checked', 'box:disabled-checked', 'box:disabled-unchecked'],
    transition: variantStyles['box:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? variantStyles['box:disabled-checked'] : variantStyles['box:disabled-unchecked']
      }
      const style = value ? variantStyles['box:checked'] : variantStyles['box:unchecked']

      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [value, disabled],
  })

  const checkmarkWrapperAnimation = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: ['checkmarkWrapper:unchecked', 'checkmarkWrapper:disabled', 'checkmarkWrapper:checked', 'checkmarkWrapper:disabled-unchecked', 'checkmarkWrapper:disabled-checked'],
    transition: variantStyles['checkmarkWrapper:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? variantStyles['checkmarkWrapper:disabled-checked'] : variantStyles['checkmarkWrapper:disabled-unchecked']
      }
      const style = value ? variantStyles['checkmarkWrapper:checked'] : variantStyles['checkmarkWrapper:unchecked']
      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [value, disabled],
  })

  const _checkboxOnLeft = checkboxOnLeft ?? variantStyles.__props?.checkboxOnLeft

  return <InputBase
    {...inputBaseProps}
    debugName={debugName}
    wrapper={Touchable}
    styles={variantStyles}
    wrapperProps={{
      onPress: () => {
        onValueChange(!value)
      },
      disabled,
      rippleDisabled: true,
    }}
    order={_checkboxOnLeft ? reversedOrder : InputBaseDefaultOrder}
    style={style}
  >
    <View
      animated
      style={[
        variantStyles.box,
        disabled && variantStyles['box:disabled'],
        boxAnimation,
      ]}
    >
      <View
        animated
        style={[
          variantStyles.checkmarkWrapper,
          disabled && variantStyles['checkmarkWrapper:disabled'],
          checkmarkWrapperAnimation,
        ]}
      >
        <Icon
          name={'check' as any}
          style={[variantStyles.checkmark, disabled && variantStyles['checkmark:disabled']]}

        />
      </View>
    </View>
  </InputBase>
}
