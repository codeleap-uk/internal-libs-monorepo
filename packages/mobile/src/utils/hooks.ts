import { onMount, onUpdate, shadeColor, TypeGuards, usePrevious, useRef, useState } from '@codeleap/common'
import { Animated, AppState, AppStateStatus, Platform, PressableAndroidRippleConfig, BackHandler } from 'react-native'

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

export function useAppState(filter?: AppStateStatus[]) {
  const [appState, setAppState] = useState(() => AppState.currentState)

  onMount(() => {
    AppState.addEventListener('change', s => {
      if (!filter || filter.includes(s)) {
        setAppState(s)
      }
    })
  })

  return {
    appState,
  }
}

export function useStaticAnimationStyles<T extends Record<string|number|symbol, any>, K extends keyof T >(obj: T, keys: K[]) {
  const styles = useRef({})

  if (Object.keys(styles.current).length === 0) {
    const mappedStyles = keys.map((k) => [k, { ...obj[k] }])

    styles.current = Object.fromEntries(mappedStyles)
  }

  return styles.current as {
    [P in K] : T[K]
  }
}

export type FeedbackConfig =
| { type: 'opacity'; value?: number }
| {type: 'highlight'; color?: string; brightness?: number; shiftOpacity?: number}
| {type: 'none'}

type RippleConfig = {
  type: 'ripple'
  config?: PressableAndroidRippleConfig
  iosFallback?: FeedbackConfig
}
export type TouchableFeedbackConfig = RippleConfig | FeedbackConfig

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
        let highlightColorDefault = styles?.[hightlightPropertyIn] || '#0000'
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
