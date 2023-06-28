import * as React from 'react'
import {

  ComponentVariants,
  useDefaultComponentStyle,
  StylesOf,
  PropsOf,
} from '@codeleap/common'
import { StyleSheet } from 'react-native'
import { View } from '../View'

import {
  SwitchPresets,
  SwitchComposition,
} from './styles'
import { InputBase, InputBaseDefaultOrder, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Touchable } from '../Touchable'

export * from './styles'

export type SwitchProps = Pick<
  InputBaseProps,
  'debugName' | 'disabled' | 'label'
> & {
  variants?: ComponentVariants<typeof SwitchPresets>['variants']
  styles?: StylesOf<SwitchComposition>
  value: boolean
  onValueChange: (value: boolean) => void
  style?: PropsOf<typeof View>['style']
  switchOnLeft?: boolean
}

const reversedOrder = [...InputBaseDefaultOrder].reverse()

export const Switch = (props: SwitchProps) => {
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
    switchOnLeft,
  } = others

  const variantStyles = useDefaultComponentStyle<'u:Switch', typeof SwitchPresets>('u:Switch', {
    variants,
    styles,
    rootElement: 'wrapper',
    transform: StyleSheet.flatten,
  })

  const trackAnimation = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: ['track:off', 'track:disabled', 'track:on', 'track:disabled-on', 'track:disabled-off'],
    transition: variantStyles['track:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? variantStyles['track:disabled-on'] : variantStyles['track:disabled-off']
      }
      const style = value ? variantStyles['track:on'] : variantStyles['track:off']

      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [value, disabled],
  })

  const thumbAnimation = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: ['thumb:off', 'thumb:disabled', 'thumb:on', 'thumb:disabled-off', 'thumb:disabled-on'],
    transition: variantStyles['thumb:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? variantStyles['thumb:disabled-on'] : variantStyles['thumb:disabled-off']
      }
      const style = value ? variantStyles['thumb:on'] : variantStyles['thumb:off']
      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [value, disabled],
  })

  const _switchOnLeft = switchOnLeft ?? variantStyles.__props?.switchOnLeft

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
    order={_switchOnLeft ? reversedOrder : InputBaseDefaultOrder}
    style={style}
    disabled={disabled}

  >
    <View
      animated
      style={[
        variantStyles.track,
        disabled && variantStyles['track:disabled'],
        trackAnimation,
      ]}
    >
      <View
        animated
        style={[
          variantStyles.thumb,
          disabled && variantStyles['thumb:disabled'],
          thumbAnimation,
        ]}
      />
    </View>
  </InputBase>
}
