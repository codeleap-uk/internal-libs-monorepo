import { onUpdate, usePrevious, useRef, useState } from '@codeleap/common'
import { Animated } from 'react-native'

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
