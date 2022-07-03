import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  BaseViewProps,

  useCodeleapContext,
  AnyFunction,
} from '@codeleap/common'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import { createAnimatableComponent } from 'react-native-animatable'
import { TouchableComposition, TouchableStyles } from './styles'
import { StylesOf } from '../../types'
export type TouchableProps = Omit<
  ComponentPropsWithoutRef<typeof Pressable>,
  'onPress'
> & {
  variants?: ComponentVariants<typeof TouchableStyles>['variants']
  component?: any
  ref?: React.Ref<View>
  debugName: string
  activeOpacity?: number
  debugComponent?: string
  feedbackVariant?: 'opacity' | 'none' | 'highlight'
  onPress?: AnyFunction
  styles?: StylesOf<TouchableComposition>
} & BaseViewProps
export * from './styles'
export const Touchable: React.FC<TouchableProps> = forwardRef<
  View,
  TouchableProps
>((touchableProps, ref) => {
  const {
    variants = [],
    children,
    onPress,
    style,
    activeOpacity = 0.5,
    debugName,
    debugComponent,
    styles,
    feedbackVariant = 'opacity',
    ...props
  } = touchableProps

  const variantStyles = useDefaultComponentStyle('u:Touchable', {
    variants,
    transform: StyleSheet.flatten,
    styles,
  })

  const { logger } = useCodeleapContext()

  const press = () => {
    if (!onPress) { throw { message: 'No onPress passed to touchable', touchableProps } }

    logger.log(
      `<${debugComponent || 'Touchable'}/>  pressed`,
      debugName || variants,
      'User interaction',
    )
    onPress && onPress()
  }

  const _styles = [variantStyles.wrapper, style]

  function getFeedbackStyle(pressed:boolean, variant: TouchableProps['feedbackVariant']) {
    if (Platform.OS === 'android' && (!!variantStyles.ripple || !!props.android_ripple)) return {}
    switch (variant) {
      case 'highlight':
        return {
          backgroundColor: pressed ? '#e0e0e0' : 'transparent',
        }
        break
      case 'opacity':
        return {
          opacity: pressed ? activeOpacity : 1,
        }
      case 'none':
        return {}
    }
  }
  const rippleConfig = (!!variantStyles.ripple || !!props.android_ripple) ? {
    ...(variantStyles.ripple || {}),
    ...(props.android_ripple || {}),
  } : null
  return (
    <Pressable onPress={press} style={({ pressed }) => ([
      getFeedbackStyle(pressed, feedbackVariant),
      _styles,
    ])} android_ripple={rippleConfig} {...props} ref={ref}>
      {children}
    </Pressable>
  )
})

export const AnimatedTouchable = createAnimatableComponent(Touchable) as unknown as typeof Touchable
