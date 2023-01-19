import { ReactNode } from 'react'
import { StyleProp } from 'react-native'
import { EasingFunction } from 'react-native-animatable'

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