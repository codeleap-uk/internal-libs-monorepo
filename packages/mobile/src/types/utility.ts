import { ReactNode } from 'react'
import { StyleProp, ViewStyle, ImageStyle, TextStyle } from 'react-native'
import { EasingFn } from 'react-native-reanimated'

export type TCSS = ViewStyle & ImageStyle & TextStyle & {size?: number}

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