import { StylesOf, ComponentVariants } from '@codeleap/common'
import { MotionProps } from 'framer-motion'
import { ComponentPropsWithoutRef, ElementType } from 'react'
import { TextComposition, TextPresets } from './styles'

type DefaultProps<T extends ElementType> = ComponentPropsWithoutRef<T> &
  ComponentVariants<typeof TextPresets> & {
    component?: T
    text: string
    styles?: StylesOf<TextComposition>
    msg?: string
    debugName?: string
    debounce?: number
    pressDisabled?: boolean
    onPress?: (event: React.MouseEventHandler<T>) => void
    animated?: boolean
  }

export type TextProps<T extends ElementType> = DefaultProps<T> & (DefaultProps<T>['animated'] extends boolean ? Partial<MotionProps> : {})
