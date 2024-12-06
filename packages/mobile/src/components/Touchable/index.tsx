import React, { forwardRef } from 'react'
import { TypeGuards } from '@codeleap/types'
import { onMount } from '@codeleap/hooks'
import { useGlobalContext } from '@codeleap/common'
import { Pressable, StyleSheet, View as RNView, Insets, Platform } from 'react-native'
import { View } from '../View'
import { TouchableFeedbackConfig, usePressableFeedback } from '../../utils'
import { Keyboard } from 'react-native'
import { PressableRipple } from '../../modules/PressableRipple'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { TouchableProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const Touchable = forwardRef<RNView, TouchableProps>((touchableProps, ref) => {
  const {
    children,
    onPress,
    style,
    debugName,
    debugComponent,
    debounce,
    leadingDebounce,
    noFeedback,
    setPressed,
    rippleDisabled,
    analyticsEnabled,
    analyticsName,
    analyticsData = {},
    dismissKeyboard,
    ...props
  } = {
    ...Touchable.defaultProps,
    ...touchableProps,
  }

  const pressed = React.useRef(!!leadingDebounce)

  onMount(() => {
    if (!!leadingDebounce && !!debounce) {
      setTimeout(() => {
        pressed.current = false
      }, debounce)
    }
  })

  const styles = useStylesFor(Touchable.styleRegistryName, style)

  const { logger } = useGlobalContext()

  const press = () => {
    if (!onPress) return

    const _onPress = () => {
      logger.log(
        `<${debugComponent || 'Touchable'}/>  pressed`,
        debugName,
        'User interaction',
      )
      if (dismissKeyboard) {
        Keyboard.dismiss()
      }
      if (analyticsEnabled) {
        const name = analyticsName || debugName
        if (!!name?.trim?.()) {
          logger.analytics?.interaction(name, analyticsData)
        }
      }

      onPress()
    }
    
    if (TypeGuards.isNumber(debounce)) {
      if (pressed.current) {
        return
      }
      setPressed?.(true)
      pressed.current = true
      _onPress()
      setTimeout(() => {
        setPressed?.(false)
        pressed.current = false
      }, debounce)
    } else {
      _onPress()
    }
  }

  const _styles = StyleSheet.flatten([styles?.wrapper, props?.disabled && styles?.['wrapper:disabled']])

  const disableFeedback = !onPress || noFeedback

  const { rippleConfig, getFeedbackStyle } = usePressableFeedback(_styles, {
    hightlightPropertyIn: 'backgroundColor',
    hightlightPropertyOut: 'backgroundColor',
    disabled: disableFeedback,
    feedbackConfig: styles?.feedback as TouchableFeedbackConfig,
  })

  const Wrapper = View

  const { radiusStyle, wrapperStyle, pressableStyle } = React.useMemo(() => {
    const wrapperkeys = [
      'margin',
      'alignSelf',
      'top!',
      'left!',
      'right!',
      'bottom!',
      'position!',
      'transform!',
    ]

    const radiusKey = [
      'Radius#',
    ]

    const sharedKeys = [
      'width!',
      'height!',
      'flex!',
      'backgroundColor!',
    ]

    const wrapperStyle = {} as any
    const pressableStyle = {} as any
    const radiusStyle = {} as any

    const match = (k, key) => {
      if (k.endsWith('#')) {
        return key.includes(k.substring(0, k.length - 1))
      } else if (k.endsWith('!')) {
        return key === k.substring(0, k.length - 1)
      } else {

        return key.startsWith(k)
      }
    }

    Object.entries(_styles).forEach(([key, value]) => {
      if (radiusKey.some(k => match(k, key))) {
        wrapperStyle[key] = value
        pressableStyle[key] = value
        radiusStyle[key] = value
        return
      }

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

    wrapperStyle.overflow = 'visible'

    return {
      wrapperStyle,
      pressableStyle,
      radiusStyle,
    }
  }, [JSON.stringify(_styles)])

  const hitSlop = TypeGuards.isNumber(props.hitSlop) ? {
    top: props.hitSlop,
    left: props.hitSlop,
    right: props.hitSlop,
    bottom: props.hitSlop,
  } as Insets : props.hitSlop

  const disableRipple = disableFeedback || rippleDisabled || Platform.OS !== 'android'

  return (
    <Wrapper style={wrapperStyle} hitSlop={hitSlop}>
      {!disableRipple ? (
        <PressableRipple
          onPress={press}
          {...props}
          style={[pressableStyle, styles?.pressable]}
          rippleFades={false}
          rippleDuration={350}
          rippleOpacity={0.1}
          {...rippleConfig}
          radiusStyles={radiusStyle}
          // @ts-ignore
          ref={ref}
        >
          {children}
        </PressableRipple>
      ) : (
        <Pressable
          onPress={press}
          style={({ pressed }) => ([
            pressableStyle,
            getFeedbackStyle(pressed),
            styles?.pressable,
          ])}
          {...props}
          ref={ref}
        >
          {children}
        </Pressable>
      )}
    </Wrapper>
  )
}) as StyledComponentWithProps<TouchableProps>

Touchable.styleRegistryName = 'Touchable'
Touchable.elements = ['wrapper', 'feedback', 'pressable']
Touchable.rootElement = 'wrapper'

Touchable.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Touchable as (props: StyledComponentProps<TouchableProps, typeof styles>) => IJSX
}

Touchable.defaultProps = {
  debounce: 500,
  noFeedback: false,
  rippleDisabled: false,
  analyticsEnabled: false,
  analyticsName: null,
  dismissKeyboard: true,
} as Partial<TouchableProps>

MobileStyleRegistry.registerComponent(Touchable)
