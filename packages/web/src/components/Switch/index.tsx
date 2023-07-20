/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'
import * as React from 'react'
import { ComponentVariants, useDefaultComponentStyle, StylesOf, PropsOf } from '@codeleap/common'
import { View } from '../View'
import { SwitchPresets, SwitchComposition } from './styles'
import { InputBase, InputBaseDefaultOrder, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { motion } from 'framer-motion'

export * from './styles'

export type SwitchProps = Pick<
  InputBaseProps,
  'debugName' | 'disabled' | 'label'
> & {
  styles?: StylesOf<SwitchComposition>
  value: boolean
  onValueChange: (value: boolean) => void
  onChange?: (value: boolean) => void
  style?: PropsOf<typeof View>['style']
  switchOnLeft?: boolean
} & ComponentVariants<typeof SwitchPresets>

const reversedOrder = [...InputBaseDefaultOrder].reverse()

export const Switch = (props: SwitchProps) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps(props)

  const {
    responsiveVariants = {},
    variants = [],
    style = {},
    styles = {},
    value,
    disabled,
    debugName,
    onValueChange,
    onChange,
    switchOnLeft,
  } = others

  const variantStyles = useDefaultComponentStyle<'u:Switch', typeof SwitchPresets>('u:Switch', {
    responsiveVariants,
    variants,
    styles,
    rootElement: 'wrapper',
  })

  const trackAnimation = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: ['track:off', 'track:disabled', 'track:on', 'track:disabled-on', 'track:disabled-off'],
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

  const handleChange = () => {
    if (disabled) return
    if (onValueChange) onValueChange?.(!value)
    if (onChange) onChange?.(!value)
  }

  return <InputBase
    {...inputBaseProps}
    debugName={debugName}
    styles={{
      ...variantStyles,
      innerWrapper: [
        variantStyles.innerWrapper,
      ],
    }}
    order={_switchOnLeft ? reversedOrder : InputBaseDefaultOrder}
    style={style}
    disabled={disabled}
    noError
  >
    <motion.div
      css={[
        variantStyles.track,
        disabled && variantStyles['track:disabled'],
      ]}
      initial={false}
      animate={trackAnimation}
      transition={variantStyles['track:transition']}
      onClick={handleChange}
    >
      <motion.div
        css={[
          variantStyles.thumb,
          disabled && variantStyles['thumb:disabled'],
        ]}
        initial={false}
        animate={thumbAnimation}
        transition={variantStyles['thumb:transition']}
      />
    </motion.div>
  </InputBase>
}
