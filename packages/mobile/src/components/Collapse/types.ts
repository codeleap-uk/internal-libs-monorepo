import { ReactNode } from 'react'
import { ViewProps, ViewStyle } from 'react-native'
import type { AnimatedProps, ReduceMotion, EasingFunction, EasingFunctionFactory } from 'react-native-reanimated'

export type CollapseAnimationConfig = {
  duration?: number
  reduceMotion?: ReduceMotion
  easing?: EasingFunction | EasingFunctionFactory
}

export type CollapseProps = AnimatedProps<ViewProps> & {
  open?: boolean
  contentContainerStyle?: ViewStyle
  children: ReactNode
  animationConfig?: CollapseAnimationConfig
}
