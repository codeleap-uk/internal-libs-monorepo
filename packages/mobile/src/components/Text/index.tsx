import * as React from 'react'
import { forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  BaseViewProps,
  TypeGuards,
  useState,
} from '@codeleap/common'
import { Animated, Platform, StyleSheet, Text as NativeText, TextProps as RNTextProps } from 'react-native'
import { usePressableFeedback } from '../../utils'
import { TextPresets } from './styles'
import { ComponentWithDefaultProps } from '../../types'

export * from './styles'

export type TextProps = RNTextProps & {
  text?: React.ReactNode
  variants?: ComponentVariants<typeof TextPresets>['variants']
  animated?: boolean
  colorChangeConfig?: Partial<Animated.TimingAnimationConfig>
  debugName?: string
  debounce?: number
  pressDisabled?: boolean
}

const _Text = forwardRef<NativeText, TextProps>((textProps, ref) => {
  const { variants = [], text, children, onPress, style, debounce = 1000, pressDisabled, ...props } = {
    ...Text.defaultProps,
    ...textProps,
  }

  const pressPolyfillEnabled = Platform.select({
    ios: props.suppressHighlighting,
    android: true,
  }) && !!onPress && !pressDisabled

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
  const variantStyles = useDefaultComponentStyle<'u:Text', typeof TextPresets>('u:Text', {
    variants,
    transform: StyleSheet.flatten,
    rootElement: 'text',
  })

  const styles = StyleSheet.flatten([variantStyles.text, style])

  if (!!text && !TypeGuards.isString(text)) return <>{text}</>

  const Component = textProps.animated ? Animated.Text : NativeText

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
    style={[styles, feedbackStyle, !!onPress && pressDisabled ? variantStyles['text:disabled'] : null]}
    allowFontScaling={false}
    {...pressProps}
    // @ts-ignore
    ref={ref}
  >
    {text}
    {children}
  </Component>

})

export const Text = _Text as ComponentWithDefaultProps<TextProps & {ref?: React.MutableRefObject<NativeText> }>

Text.defaultProps = {
}

export const AnimatedText = Animated.createAnimatedComponent(Text)

