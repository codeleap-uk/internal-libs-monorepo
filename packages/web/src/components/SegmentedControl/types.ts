import React from 'react'
import { View } from '../View'
import { PropsOf, IconPlaceholder, StylesOf } from '@codeleap/common'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { SegmentedControlComposition } from './styles'
import { MotionProps, AnimationProps, ForwardRefComponent } from 'framer-motion'
import { IconProps } from '../Icon'
import { StyledProp } from '@codeleap/styles'

export type SegmentedControlProps<T = string> = {
    options : SegmentedControlOptionProps[]
    value?: T
    style?: StyledProp<SegmentedControlComposition>
    onValueChange?: (v: any) => void
    bubbleProps?: React.HTMLAttributes<HTMLDivElement> & MotionProps
    label?: string
    touchableProps?: Partial<PropsOf<typeof Touchable>>
    debugName?: string
    disabled?: boolean
    animationProps?: AnimationProps
    transitionDuration?: number
    RenderAnimatedView?: ForwardRefComponent<HTMLDivElement, any>
    textProps?: Omit<PropsOf<typeof Text>, 'key'>
    iconProps?: Partial<IconProps>
    debounce?: number
    debounceEnabled?: boolean
}

export type OptionRef = PropsOf<typeof Touchable>['ref']

export type SegmentedControlOptionProps = PropsOf<typeof Touchable> & {
  selected?: boolean
  label: string
  styles?: StylesOf<SegmentedControlComposition>
  value?: any
  textProps?: Omit<PropsOf<typeof Text>, 'key'>
  iconProps?: Partial<IconProps>
  icon?: IconPlaceholder
  ref?: OptionRef
}
