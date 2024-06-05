import { ComponentPropsWithoutRef, ElementType } from 'react'
import { TextComposition } from './styles'
import { StyledProp } from '@codeleap/styles'
import { MotionProps } from 'framer-motion'

export type TextProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
    component?: T
    text?: string
    style?: StyledProp<TextComposition>
    debugName?: string
    debounce?: number
    pressDisabled?: boolean
    onPress?: (event: React.MouseEventHandler<T>) => void
    animated?: boolean
    animatedProps?: Partial<MotionProps>
  }
