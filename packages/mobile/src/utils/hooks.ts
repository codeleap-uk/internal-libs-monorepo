import { onMount, onUpdate, shadeColor, TypeGuards, usePrevious, useRef, useState } from '@codeleap/common'
import { Animated, AppState, AppStateStatus, Platform, PressableAndroidRippleConfig, BackHandler, ViewStyle, ImageStyle, TextStyle, StyleSheet } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'
import { AnimatedStyleProp, Easing, EasingFn, interpolateColor, runOnJS, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

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

type AnimatableProperties = 'scale' | 'scaleX' | 'scaleY' | 'translateX' | 'translateY' | 'opacity' | 'color' | 'backgroundColor'

type VariantTransitionConfig = {
  type: 'timing'
  duration?: number
  easing?: EasingFn
} 

export type TransitionConfig = Partial<Record<AnimatableProperties, VariantTransitionConfig>> | VariantTransitionConfig


type UseAnimatedVariantStylesConfig<T extends Record<string|number|symbol, any>, K extends keyof T > = {
  variantStyles: T
  animatedProperties: K[]
  updater: (states: SelectProperties<T, K>) => AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle>
  transition: TransitionConfig
  dependencies?: any[]
}

const buildAnimatedStyle = (property: AnimatableProperties, value, currentStyle, applyFN = (v) => v) => {
  'worklet';
  const newStyle = {...currentStyle}
  
  switch(property){
    case 'opacity':
      newStyle.opacity = applyFN(value)
      break
    case 'backgroundColor':
    case 'color':
      newStyle[property] = value
      break
    default:
      if(!newStyle.transform){
        newStyle.transform = []
      }
      newStyle.transform.push({
        [property]: applyFN(value)
      })
  }

  return newStyle

}


const transformProperties = (properties, transition, previousStyle) => {
  'worklet';
  let styles = {
    ...previousStyle
  }

  let fn
  for(const [prop, value] of Object.entries(properties)){
    let transitionConfig = transition[prop] || transition

    const _transitionConfig = {
      type:'timing',
      duration: 100,
      easing: Easing.linear,
      ...transitionConfig
    }

    const { type, duration, easing } = _transitionConfig


    switch(type){
      case 'timing':
        fn = (v) => withTiming(v, {
          duration,
          easing
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

  return [styles, fn]
}


export function useAnimatedVariantStyles<T extends Record<string|number|symbol, any>, K extends keyof T >(config: UseAnimatedVariantStylesConfig<T, K>){
  const { animatedProperties, updater, variantStyles, transition, dependencies = []} = config
  
  const _transition = useRef(null)

  if(!_transition.current){
    _transition.current = JSON.parse(JSON.stringify(transition))
  }

  const prevStyle = useAnimatedRef()

  const staticStyles = useStaticAnimationStyles(variantStyles, animatedProperties)
  
  const currentColor = useRef(null)

  const [color, setColor] = useState(0)
  
  const prevColor = usePrevious(color)
  const _color = useSharedValue(0)


  function onColorChange(to){
    if(currentColor.current === to){
      return
    }
    currentColor.current = to
    _color.value = withTiming(color === 0 ? 1 : 0, {
      duration: 2000
    }, () => {
      runOnJS(setColor)(to)
    })

  }

  const animated = useAnimatedStyle(() => {
    const nextState = updater(staticStyles)

    
    const [formatted, transitionFN] = transformProperties(
      nextState, 
      _transition.current, 
      prevStyle.current,
      
    )

    if(!!nextState.color){
      runOnJS(onColorChange)(nextState.color)
    }

    prevStyle.current = nextState

    if(!!prevColor && !!currentColor.current){
      formatted.color = interpolateColor(
        _color.value,
        [0,1],
        [prevColor, currentColor.current]
      )
    }
    return formatted
  }, [dependencies])


  return animated
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
type StateSetter<T> = T | ((prev:T) => T)

export function useAsyncStorageState<T>(key:string, defaultValue?: T) {
  const [value, _setValue] = useState<T>(undefined)

  onMount(() => {
    AsyncStorage.getItem(key).then(val => {
      let storedValue = defaultValue

      if (val) {
        storedValue = JSON.parse(val)
      }

      _setValue(storedValue)
    })
  })

  const setValue = (to: StateSetter<T>) => {
    return new Promise<void>((resolve, reject) => {
      _setValue((prev) => {
        let newValue = prev
        try {

          if (typeof to !== 'function') {
            newValue = to
          } else {
            const fn = to as ((prev:T) => T)
            newValue = fn(value)
          }

          const jsonVal = JSON.stringify(newValue)

          AsyncStorage.setItem(key, jsonVal).then(resolve).catch(reject)
          resolve()
          return newValue
        } catch (e) {
          reject(e)
          return newValue
        }

      })
    })

  }

  return [value, setValue] as [T, typeof setValue]
}

