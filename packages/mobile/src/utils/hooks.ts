import { onUpdate, usePrevious, useRef, useState } from '@codeleap/hooks'
import { shadeColor } from '@codeleap/utils'
import { TypeGuards } from '@codeleap/types'
import { Animated, Platform, BackHandler, ViewStyle, ImageStyle, TextStyle, StyleSheet, StyleProp } from 'react-native'
import { AnimatedStyle, Easing, EasingFunction, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { PressableRippleProps } from '../modules/PressableRipple/type'
import { useMemo } from 'react'
import { mergeStyles } from '@codeleap/styles'
import { useKeyboardController } from '../hooks'

export function useAnimateColor(value: string, opts?: Partial<Animated.TimingAnimationConfig>) {
  const iters = useRef(0)
  const [anim] = useState(new Animated.Value(iters.current))
  const _prev = usePrevious(value)
  const prev = _prev || value

  onUpdate(() => {
    // if (value === prev) return
    const animation = Animated.timing(anim, {
      ...opts,
      toValue: iters.current + 1,
      useNativeDriver: false,

    })
    animation.start(() => {
      iters.current += 1
    })

    return () => {
      animation.stop()

    }
  }, [value])

  const color = anim.interpolate({
    outputRange: [prev, value],
    inputRange: [iters.current, iters.current + 1],
  })

  return color

}

type SelectProperties<T extends Record<string|number|symbol, any>, K extends keyof T> = {
  [P in K] : T[K]
}

export function useStaticAnimationStyles<T extends Record<string|number|symbol, any>, K extends keyof T >(obj: T, keys: K[]) {
  const styles = useRef({})

  if (Object.keys(styles.current).length === 0) {
    const mappedStyles = keys.map((k) => [k, { ...obj[k] }])

    styles.current = Object.fromEntries(mappedStyles)
  }

  return styles.current as SelectProperties<T, K>
}

type AnimatableProperties = 'scale' | 'scaleX' | 'scaleY' | 'translateX' | 'translateY' | 'opacity' | 'backgroundColor'

type VariantTransitionConfig = {
  type: 'timing'
  duration?: number
  easing?: EasingFunction
}

export type TransitionConfig = Partial<Record<AnimatableProperties, VariantTransitionConfig>> | VariantTransitionConfig

type UseAnimatedVariantStylesConfig<T extends Record<string|number|symbol, any>, K extends keyof T > = {
  variantStyles: T
  animatedProperties: K[]
  updater: (states: SelectProperties<T, K>) => AnimatedStyle<ViewStyle | ImageStyle | TextStyle>
  transition?: TransitionConfig
  dependencies?: any[]
}

const buildAnimatedStyle = (property: AnimatableProperties, value, currentStyle, applyFN = (v) => v) => {
  'worklet'
  const newStyle = { ...currentStyle }

  switch (property) {
    case 'opacity':
      newStyle.opacity = applyFN(value)
      break
    case 'backgroundColor':
      newStyle.backgroundColor = applyFN(value)
      break
    case 'scale':
    case 'scaleX':
    case 'scaleY':
    case 'translateX':
    case 'translateY':
      if (!newStyle.transform) {
        newStyle.transform = []
      }
      newStyle.transform.push({
        [property]: applyFN(value),
      })
    default:
      newStyle[property] = value
      break
  }

  return newStyle

}

const transformProperties = (properties, transition) => {
  'worklet'
  let styles = {}

  for (const [prop, value] of Object.entries(properties)) {
    const transitionConfig = transition[prop] || transition

    const _transitionConfig = {
      type: 'timing',
      duration: 100,
      easing: Easing.linear,
      ...transitionConfig,
    }

    const { type, duration, easing } = _transitionConfig

    let fn = (v) => v

    switch (type) {
      case 'timing':
        fn = (v) => withTiming(v, {
          duration,
          easing,
        })
        break
      default:
        break
    }

    styles = buildAnimatedStyle(
      prop as AnimatableProperties,
      value,
      styles,
      fn,
    )
  }

  return styles
}

export function useAnimatedVariantStyles<T extends Record<string|number|symbol, any>, K extends keyof T >(config: UseAnimatedVariantStylesConfig<T, K>) {
  const { animatedProperties, updater, variantStyles, transition = {}, dependencies = [] } = config

  const _transition = useRef(null)

  if (!_transition.current) {
    _transition.current = JSON.parse(JSON.stringify(transition || {}))
  }

  const staticStyles = useStaticAnimationStyles(variantStyles, animatedProperties)

  const animated = useAnimatedStyle(() => {
    const nextState = updater(staticStyles)

    const formatted = transformProperties(
      nextState,
      _transition.current,
    )

    return formatted
  }, dependencies)

  return animated
}

export type FeedbackConfig =
| { type: 'opacity'; value?: number }
| {type: 'highlight'; color?: string; brightness?: number; shiftOpacity?: number}
| {type: 'styles'; styles: StyleProp<ViewStyle> }
| {type: 'none'}

type RippleConfig = {
  type: 'ripple'
  config?: PressableRippleProps
  iosFallback?: FeedbackConfig
}
export type TouchableFeedbackConfig = RippleConfig | FeedbackConfig

export type TouchFeedbackConfig = {
  type?: 'ripple' | 'opacity' | 'highlight' | 'styles' | 'none'
  config?: PressableRippleProps
  iosFallback?: FeedbackConfig
  value?: number
  brightness?: number
  shiftOpacity?: number
  styles?: StyleProp<ViewStyle>
}

export type UsePressableFeedbackConfig = {
  disabled?: boolean
  feedbackConfig?: TouchableFeedbackConfig
  hightlightPropertyIn: 'backgroundColor' | 'borderColor' | 'color'
  hightlightPropertyOut: 'backgroundColor' | 'borderColor' | 'color'
}

export function usePressableFeedback(styles: any, config:UsePressableFeedbackConfig) {
  const {
    disabled,
    feedbackConfig,
    hightlightPropertyIn = 'backgroundColor',
    hightlightPropertyOut = 'backgroundColor',
  } = config
  const _feedbackConfig = {
    ...feedbackConfig,
  }
  let style

  if (TypeGuards.isObject(styles)) {
    style = styles?.[hightlightPropertyIn]
  } else if (TypeGuards.isArray(styles)) {
    style = styles.reverse().find(s => s[hightlightPropertyIn])
  } else {
    style = StyleSheet.flatten(styles)[hightlightPropertyIn]
  }

  const disableFeedback = disabled
  const rippleEnabled = _feedbackConfig?.type === 'ripple' && !disableFeedback
  const rippleConfig = rippleEnabled ? _feedbackConfig?.config : null

  function getFeedbackStyle(pressed:boolean) {
    if (disableFeedback) return {}
    let feedbackConfig = { ..._feedbackConfig }

    if (rippleEnabled && feedbackConfig.type === 'ripple' && Platform.OS === 'ios' && !!_feedbackConfig?.iosFallback) {
      feedbackConfig = feedbackConfig?.iosFallback
    }
    switch (feedbackConfig.type) {
      case 'highlight':
        if (!pressed && hightlightPropertyIn !== hightlightPropertyOut) return {}
        let highlightColorDefault = style || '#0000'
        if (pressed) {
          if (feedbackConfig?.color) {
            highlightColorDefault = feedbackConfig?.color
          } else {
            let opacity = feedbackConfig?.shiftOpacity
            let brightness = feedbackConfig?.brightness
            if (!TypeGuards.isNumber(opacity)) {
              opacity = 1
            }
            if (!TypeGuards.isNumber(brightness)) {
              brightness = 0
            }
            highlightColorDefault = shadeColor(highlightColorDefault, brightness * 100, opacity)
          }
        }
        return {
          [hightlightPropertyOut]: highlightColorDefault,
        }
        break
      case 'opacity':
        return {
          opacity: pressed ? feedbackConfig?.value : 1,
        }
      case 'styles':
        return pressed ? feedbackConfig?.styles : {}
      case 'none':
        return {}
    }
  }

  return {
    getFeedbackStyle,
    rippleConfig,
  }
}

export function useBackButton(cb: () => boolean|void, deps = []) {
  onUpdate(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const stopBubbling = cb()

      if (TypeGuards.isBoolean(stopBubbling)) {
        return stopBubbling
      }

      return false

    })
    return () => {
      subscription.remove()
    }
  }, deps)
}

export function useKeyboardPaddingStyle(styles: ViewStyle[], enabled = true) {
  const { isVisible, height } = useKeyboardController()

  const propStyle = useMemo(() => {
    return StyleSheet.flatten(styles)
  }, styles)

  const bottomPadding = propStyle && TypeGuards.isNumber(propStyle.paddingBottom) ? propStyle.paddingBottom : 0

  const totalPadding = height + bottomPadding

  return isVisible && enabled ? mergeStyles([propStyle, { paddingBottom: totalPadding }]) : propStyle
}
