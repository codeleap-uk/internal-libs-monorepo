import { onMount, onUpdate, usePrevious, useRef, useState } from '@codeleap/common'
import { Animated, AppState, AppStateStatus } from 'react-native'

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
