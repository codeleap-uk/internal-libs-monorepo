import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  BaseViewProps,

  useCodeleapContext,
  AnyFunction,
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
  styles?: StylesOf<TouchableComposition>
} & BaseViewProps
export * from './styles'

const defaultWrapperStyles = {
  paddingTop: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
  overflow: 'hidden',
  alignItems: 'stretch',
}

const defaultPressableStyles = {
  marginTop: 0,
  marginLeft: 0,
  marginRight: 0,
  marginBottom: 0,

}

const ripplePressableStyles = {
  // position: 'absolute',
  // top: 0,
  // left: 0,
  // right: 0,
  // bottom: 0,
  // width: '100%',
  // minWidth: '100%',
  // maxWidth: '100%',
  // height: '100%',
  // minHeight: '100%',
  // maxHeight: '100%',
  // flex: 1,
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
    debugName,
    debugComponent,
    noFeedback = false,
    styles,
    ...props
  } = touchableProps

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
      // 'flex!',
    ]
    const sharedKeys = [
      'width!',
      'height!',
      'flex!',
      'position!',
      'top!',
      'left!',
      'right!',
      'bottom!',
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

      ])} android_ripple={rippleConfig} {...props} ref={ref}>
        {children}
      </Pressable>
    </Wrapper>
  )
})

export const AnimatedTouchable = createAnimatableComponent(Touchable) as unknown as typeof Touchable
