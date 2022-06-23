import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  BaseViewProps,
  TextStyles,
} from '@codeleap/common'
import { Animated, StyleSheet, Text as NativeText } from 'react-native'
import { MotiText as _MotiText, MotiProps } from 'moti'
import { useAnimateColor } from '../utils/hooks'
export type TextProps = ComponentPropsWithoutRef<typeof NativeText> & {
  text?: string
  variants?: ComponentVariants<typeof TextStyles>['variants']
  animated?: boolean
  colorChangeConfig?: Partial<Animated.TimingAnimationConfig>
} & BaseViewProps & MotiProps

const MotiText = Animated.createAnimatedComponent(_MotiText)

export const Text = forwardRef<NativeText, TextProps>((textProps, ref) => {
  const { variants = [], text, children, style, colorChangeConfig, ...props } = textProps

  const variantStyles = useDefaultComponentStyle('Text', {
    variants,
    rootElement: 'text',
  })

  const styles = StyleSheet.flatten([variantStyles.text, style])

  const animatedColor = useAnimateColor(styles.color, colorChangeConfig)

  const Component = textProps.animated ? MotiText : NativeText

  const colorStyle = { color: props.animated ? animatedColor : styles.color }

  // @ts-ignore
  return <Component {...props} style={[styles, colorStyle]} ref={ref}>
    {text || children}
  </Component>

})

