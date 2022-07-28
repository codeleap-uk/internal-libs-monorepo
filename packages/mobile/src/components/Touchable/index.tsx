import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  BaseViewProps,

  useCodeleapContext,
  AnyFunction,
  defaultPresets,
} from '@codeleap/common'
import { Platform, Pressable, StyleSheet, View as RNView } from 'react-native'

import { createAnimatableComponent } from 'react-native-animatable'
import { TouchableComposition, TouchableStyles } from './styles'
import { StylesOf } from '../../types'
import { View } from '../View'
export type TouchableProps = Omit<
  ComponentPropsWithoutRef<typeof Pressable>,
  'onPress'
> & {
  variants?: ComponentVariants<typeof TouchableStyles>['variants']
  component?: any
  ref?: React.Ref<RNView>
  debugName: string
  activeOpacity?: number
  debugComponent?: string
  feedbackVariant?: 'opacity' | 'none' | 'highlight'
  onPress?: AnyFunction
  styles?: StylesOf<TouchableComposition>
} & BaseViewProps
export * from './styles'

const rippleStyles = {
  paddingTop: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
  overflow: 'hidden',
}

const defaultPressableStyles = {
  marginTop: 0,
  marginLeft: 0,
  marginRight: 0,
  marginBottom: 0,
  // height: '100%',
  minWidth: '100%',
  // minHeight: '100%',
  // maxHeight: '100%',
  maxWidth: '100%',

}

export const Touchable: React.FC<TouchableProps> = forwardRef<
  RNView,
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
  const _feedbackVariant = onPress ? feedbackVariant : 'none'
  const variantStyles = useDefaultComponentStyle<'u:Touchable', typeof TouchableStyles>('u:Touchable', {
    variants,
    transform: StyleSheet.flatten,
    rootElement: 'wrapper',
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

  const _styles = StyleSheet.flatten([variantStyles.wrapper, style])

  const hasRipple = (!!variantStyles.ripple || !!props.android_ripple) && _feedbackVariant !== 'none'
  function getFeedbackStyle(pressed:boolean) {
    if (Platform.OS === 'android' && hasRipple) return {}
    switch (_feedbackVariant) {
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

  const rippleConfig = hasRipple ? {
    ...(variantStyles.ripple || {}),
    ...(props.android_ripple || {}),
  } : null

  const Wrapper = View

  return (
    <Wrapper style={[_styles, rippleStyles]}>
      <Pressable onPress={press} style={({ pressed }) => ([
        getFeedbackStyle(pressed),
        variantStyles.pressable,
        _styles,
        defaultPressableStyles,
      ])} android_ripple={rippleConfig} {...props} ref={ref}>
        {children}
      </Pressable>
    </Wrapper>
  )
})

export const AnimatedTouchable = createAnimatableComponent(Touchable) as unknown as typeof Touchable
