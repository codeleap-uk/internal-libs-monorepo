import { ReactNode } from 'react'
import { StyleProp } from 'react-native'
import { EasingFn, EntryAnimationsValues, ExitAnimationsValues, LayoutAnimation, StyleProps } from 'react-native-reanimated'

export type StylesOf<C extends string> = Partial<Record<C, StyleProp<any>>>
type TransitionBase = {
  easing?: EasingFn
  type?: string
  duration?: number
}
export type TransitionConfig = TransitionBase | {
  [p: string] : TransitionBase
}

export type ChildrenProp = ReactNode | ReactNode[] | undefined

export type ReanimatedExitingAnimation = (values: ExitAnimationsValues) => LayoutAnimation
export type ReanimatedEnteringAnimation = (values: EntryAnimationsValues) => LayoutAnimation

