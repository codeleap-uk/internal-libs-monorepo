import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  BaseViewProps,

  useCodeleapContext,
  AnyFunction,
  TypeGuards,
} from '@codeleap/common'
import { Pressable, StyleSheet, View as RNView } from 'react-native'

import { createAnimatableComponent } from 'react-native-animatable'
import { TouchableComposition, TouchableStyles } from './styles'
import { StylesOf } from '../../types'
import { View } from '../View'
import { usePressableFeedback } from '../../utils'
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
  onPress?: AnyFunction
  noFeedback?: boolean
  debounce?: number
  styles?: StylesOf<TouchableComposition>
} & BaseViewProps
export * from './styles'

export const Touchable: React.FC<TouchableProps> = forwardRef<
  RNView,
  TouchableProps
>((touchableProps, ref) => {
  const {
    variants = [],
    children,
    onPress,
    style,
    debugName,
    debugComponent,
    debounce = 1000,
    noFeedback = false,
    styles,
    ...props
  } = touchableProps
  const pressed = React.useRef(false)
  const variantStyles = useDefaultComponentStyle<'u:Touchable', typeof TouchableStyles>('u:Touchable', {
    variants,
    transform: StyleSheet.flatten,
    rootElement: 'wrapper',
    styles,
  })

  const { logger } = useCodeleapContext()

  const press = () => {
    if (!onPress) {
      logger.warn('No onPress passed to touchable', {
        touchableProps,
      }, 'User Interaction')
      return
    }
    const _onPress = () => {
      logger.log(
        `<${debugComponent || 'Touchable'}/>  pressed`,
        debugName || variants,
        'User interaction',
      )
      onPress && onPress()
    }
    if (TypeGuards.isNumber(debounce)) {
      if (pressed.current) {
        return
      }
      pressed.current = true
      _onPress()
      setTimeout(() => {
        pressed.current = false
      }, debounce)
    } else {
      _onPress()
    }

  }

  const _styles = StyleSheet.flatten([variantStyles.wrapper, style])

  const disableFeedback = !onPress || noFeedback

  const { rippleConfig, getFeedbackStyle } = usePressableFeedback(_styles, {
    hightlightPropertyIn: 'backgroundColor',
    hightlightPropertyOut: 'backgroundColor',
    disabled: disableFeedback,
    feedbackConfig: variantStyles?.feedback,
  })

  const Wrapper = View

  const { wrapperStyle, pressableStyle } = React.useMemo(() => {
    const wrapperkeys = [
      'margin',
      'alignSelf',
      'border',
      'top!',
      'left!',
      'right!',
      'bottom!',
      'position!',
      // 'flex!',
    ]
    const sharedKeys = [
      'width!',
      'height!',
      'flex!',
      'backgroundColor!',
    ]

    const wrapperStyle = {} as any
    const pressableStyle = {} as any
    const match = (k, key) => {
      if (k.endsWith('!')) {
        return key === k.substring(0, k.length - 1)
      } else {

        return key.startsWith(k)
      }
    }
    Object.entries(_styles).forEach(([key, value]) => {

      if (wrapperkeys.some(k => match(k, key))) {
        wrapperStyle[key] = value
      } else if (sharedKeys.some(k => match(k, key))) {
        wrapperStyle[key] = value

        pressableStyle[key] = value
      } else {
        pressableStyle[key] = value
      }
    })
    if (wrapperStyle.position === 'absolute') {
      pressableStyle.width = '100%'
      pressableStyle.height = '100%'
    }
    wrapperStyle.overflow = 'hidden'
    // wrapperStyle.flexDirection = 'row'
    // wrapperStyle.alignItems = 'stretch'

    return {
      wrapperStyle,
      pressableStyle,
    }
  }, [JSON.stringify(_styles)])

  return (
    <Wrapper style={[wrapperStyle]}>
      <Pressable onPress={press} style={({ pressed }) => ([

        // defaultPressableStyles,
        pressableStyle,
        // !!rippleConfig && ripplePressableStyles,
        getFeedbackStyle(pressed),
        variantStyles.pressable,
      ])} android_ripple={rippleConfig} {...props} ref={ref}>
        {children}
      </Pressable>
    </Wrapper>
  )
})

export const AnimatedTouchable = createAnimatableComponent(Touchable) as unknown as typeof Touchable
