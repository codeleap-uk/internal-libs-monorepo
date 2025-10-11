import { ReactNode } from 'react'
import { StyleProp } from 'react-native'
import { EasingFunction, EntryAnimationsValues, ExitAnimationsValues, LayoutAnimation, StyleProps } from 'react-native-reanimated'

export type StylesOf<C extends string> = Partial<Record<C, StyleProp<any>>>
type TransitionBase = {
  easing?: EasingFunction
  type?: string
  duration?: number
}
export type TransitionConfig = TransitionBase | {
  [p: string] : TransitionBase
}

export type ChildrenProp = ReactNode | ReactNode[] | undefined

export type ReanimatedExitingAnimation = (values: ExitAnimationsValues) => LayoutAnimation
export type ReanimatedEnteringAnimation = (values: EntryAnimationsValues) => LayoutAnimation

export type GetKeyboardAwarePropsOptions = {
  baseStyleProp?: 'style' | 'contentContainerStyle'
  adapt?: 'height' | 'maxHeight' | 'paddingBottom' | 'marginBottom' | 'bottom'
  enabled?: boolean
  animated?: boolean
  transition?: TransitionConfig
  enableOnAndroid?: boolean
}