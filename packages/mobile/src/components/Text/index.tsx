import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  BaseViewProps,
  TypeGuards,
  useState,
} from '@codeleap/common'
import { Animated, Platform, StyleSheet, Text as NativeText } from 'react-native'
import { MotiText as _MotiText, MotiProps } from 'moti'
import { useAnimateColor, usePressableFeedback } from '../../utils'
import { TextStyles } from './styles'

export * from './styles'

export type TextProps = ComponentPropsWithoutRef<typeof NativeText> & {
  text?: React.ReactNode
  variants?: ComponentVariants<typeof TextStyles>['variants']
  animated?: boolean
  colorChangeConfig?: Partial<Animated.TimingAnimationConfig>
  debugName?: string
  debounce?: number
  pressDisabled?: boolean
} & BaseViewProps & MotiProps

const MotiText = Animated.createAnimatedComponent(_MotiText)

export const Text = forwardRef<NativeText, TextProps>((textProps, ref) => {
  const { variants = [], text, children, onPress, style, colorChangeConfig, debounce = 1000, pressDisabled, ...props } = textProps

  const pressPolyfillEnabled = Platform.OS === 'android' && !!onPress && !pressDisabled

  const [pressed, setPressed] = useState(false)
  const pressedRef = React.useRef(false)

  const _onPress:TextProps['onPress'] = (e) => {
    if (!onPress) return

    if (TypeGuards.isNumber(debounce)) {
      if (pressedRef.current) {
        return
      }

      pressedRef.current = true
      onPress?.(e)
      setTimeout(() => {
        pressedRef.current = false
      }, debounce)

    } else {
      onPress?.(e)
    }
  }

  const handlePress = (pressed) => {
    if (!pressPolyfillEnabled) return
    return () => {
      if (onPress) {
        setPressed(pressed)
      }
    }
  }
  const variantStyles = useDefaultComponentStyle<'u:Text', typeof TextStyles>('u:Text', {
    variants,
    transform: StyleSheet.flatten,
    rootElement: 'text',
  })

  const styles = StyleSheet.flatten([variantStyles.text, style])

  const animatedColor = useAnimateColor(styles.color, colorChangeConfig)

  if (!!text && !TypeGuards.isString(text)) return <>{text}</>

  const Component = textProps.animated ? MotiText : NativeText

  const colorStyle = { color: props.animated ? animatedColor : styles.color }

  const { getFeedbackStyle } = usePressableFeedback(styles, {
    disabled: !pressPolyfillEnabled,
    feedbackConfig: variantStyles.pressFeedback,
    hightlightPropertyIn: 'color',
    hightlightPropertyOut: 'backgroundColor',
  })
  const feedbackStyle = pressPolyfillEnabled ? getFeedbackStyle(pressed) : undefined

  const pressProps = !!onPress ? {
    onPress: pressDisabled ? null : _onPress,
  } : {}

  return <Component {...props}
    onPressIn={handlePress(true)} onPressOut={handlePress(false)}
    style={[styles, colorStyle, feedbackStyle, !!onPress && pressDisabled ? variantStyles['text:disabled'] : null]}
    allowFontScaling={false}
    {...pressProps}
    // @ts-ignore
    ref={ref}
  >
    {text}
    {children}
  </Component>

})

// const childArr = React.Children.toArray([
//   text,
//   children,
// ])

// return <View style={[styles, colorStyle]}>
//   {
//     childArr.map((child) => {
//       if (TypeGuards.isString(child)) {
//         // @ts-ignore
//         return <Component {...props} ref={ref}>
//           {child}
//         </Component>

//       }
//       return child
//     })
//   }
// </View>
