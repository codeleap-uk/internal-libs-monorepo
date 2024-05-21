import React, { forwardRef, useState, ReactElement } from 'react'
import { TypeGuards } from '@codeleap/common'
import { Animated, Platform, Text as NativeText } from 'react-native'
import { TouchableFeedbackConfig, usePressableFeedback } from '../../utils'
import { TextProps } from './types'
import { AnyRecord, GenericStyledComponentAttributes, IJSX, StyledComponentProps, useStyleObserver } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useMemo } from 'react'

export * from './styles'
export * from './types'

export const Text = forwardRef<NativeText, TextProps>((textProps, ref) => {
  const {
    text,
    children,
    onPress,
    style,
    debounce = 1000,
    pressDisabled,
    animated,
    animatedStyle,
    ...props
  } = textProps

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

  const styleObserver = useStyleObserver(style)

  const styles = useMemo(() => {
    return MobileStyleRegistry.current.styleFor(Text.styleRegistryName, style)
  }, [styleObserver])

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
}) as unknown as ((props: TextProps & { ref?: React.MutableRefObject<NativeText> }) => ReactElement) & GenericStyledComponentAttributes<AnyRecord>

Text.styleRegistryName = 'Text'
Text.elements = ['text', 'pressFeedback']
Text.rootElement = 'text'

Text.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Text as (props: StyledComponentProps<TextProps & { ref?: React.MutableRefObject<NativeText> }, typeof styles>) => IJSX
}

MobileStyleRegistry.registerComponent(Text)

export const AnimatedText = Animated.createAnimatedComponent(Text)
