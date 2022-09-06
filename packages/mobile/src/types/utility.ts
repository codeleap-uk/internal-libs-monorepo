import { StyleProp } from 'react-native'
import { EasingFunction } from 'react-native-animatable'

export type StylesOf<C extends string> = Partial<Record<C, StyleProp<any>>>
export type TransitionConfig = {
    easing?: EasingFunction
    type?: 'timing' | 'spring'
    duration?: number
  }
