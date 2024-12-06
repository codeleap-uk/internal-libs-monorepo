import React, { forwardRef, useState } from 'react'
import { TypeGuards } from '@codeleap/types'
import { Animated, Platform, Text as NativeText } from 'react-native'
import { TouchableFeedbackConfig, usePressableFeedback } from '../../utils'
import { TextProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const Text = forwardRef<NativeText, TextProps>((textProps, ref) => {
  const {
    text,
    children,
    onPress,
    style,
    debounce,
    pressDisabled,
    animated,
    animatedStyle,
    ...props
  } = {
    ...Text.defaultProps,
    ...textProps,
  }

  const pressPolyfillEnabled = Platform.select({
    ios: props.suppressHighlighting,
    android: true,
  }) && !!onPress && !pressDisabled

  const [pressed, setPressed] = useState(false)
  const pressedRef = React.useRef(false)

  const _onPress: TextProps['onPress'] = (e) => {
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

  const styles = useStylesFor(Text.styleRegistryName, style)

  if (!!text && !TypeGuards.isString(text)) return <>{text}</>

  const Component = animated ? Animated.Text : NativeText

  const { getFeedbackStyle } = usePressableFeedback(styles, {
    disabled: !pressPolyfillEnabled,
    feedbackConfig: styles?.pressFeedback as TouchableFeedbackConfig,
    hightlightPropertyIn: 'color',
    hightlightPropertyOut: 'backgroundColor',
  })

  const feedbackStyle = pressPolyfillEnabled ? getFeedbackStyle(pressed) : undefined

  const pressProps = !!onPress ? {
    onPress: pressDisabled ? null : _onPress,
  } : {}

  const disabled = !!onPress && pressDisabled

  return (
    <Component
      {...props}
      onPressIn={handlePress(true)} onPressOut={handlePress(false)}
      style={[styles?.text, animatedStyle, feedbackStyle, disabled ? styles['text:disabled'] : null]}
      allowFontScaling={false}
      {...pressProps}
      // @ts-ignore
      ref={ref}
    >
      {text}
      {children}
    </Component>
  )
}) as StyledComponentWithProps<TextProps>

Text.styleRegistryName = 'Text'
Text.elements = ['text', 'pressFeedback']
Text.rootElement = 'text'

Text.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Text as (props: StyledComponentProps<TextProps, typeof styles>) => IJSX
}

Text.defaultProps = {
  debounce: 1000,
} as Partial<TextProps>

MobileStyleRegistry.registerComponent(Text)

export const AnimatedText = Animated.createAnimatedComponent(Text)
