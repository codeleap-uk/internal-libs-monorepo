import React from 'react'
import { StylesOf } from '@codeleap/common'
import { TextProps } from '../Text'
import { TouchableProps } from '../Touchable'
import { SegmentedControlComposition } from './styles'
import { MotionProps, AnimationProps, ForwardRefComponent } from 'framer-motion'
import { IconProps } from '../Icon'
import { AppIcon, StyledProp } from '@codeleap/styles'

export type SegmentedControlProps<T = string> = {
  options: SegmentedControlOptionProps[]
  value?: T
  style?: StyledProp<SegmentedControlComposition>
  onValueChange?: (v: any) => void
  bubbleProps?: React.HTMLAttributes<HTMLDivElement> & MotionProps
  label?: string
  touchableProps?: Partial<TouchableProps>
  debugName?: string
  disabled?: boolean
  animationProps?: AnimationProps
  transitionDuration?: number
  RenderAnimatedView?: ForwardRefComponent<HTMLDivElement, any>
  textProps?: TextProps
  iconProps?: Partial<IconProps>
  debounce?: number
  debounceEnabled?: boolean
}

export type OptionRef = TouchableProps['ref']

export type SegmentedControlOptionProps =
  TouchableProps &
  {
    selected?: boolean
    label: string
    styles?: StylesOf<SegmentedControlComposition>
    value?: any
    textProps?: TextProps
    iconProps?: Partial<IconProps>
    icon?: AppIcon
    largestWidth?: {
      width: number
    }
  }
