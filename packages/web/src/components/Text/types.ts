import { ComponentPropsWithoutRef, ElementType, RefObject } from 'react'
import { TextComposition } from './styles'
import { AnyRecord, StyledProp } from '@codeleap/styles'
import { MotionProps } from 'framer-motion'

export type TextProps<T extends ElementType = 'p'> =
  Omit<ComponentPropsWithoutRef<T>, 'style'> &
  {
    component?: ElementType<AnyRecord>
    text?: string
    style?: StyledProp<TextComposition>
    debugName?: string
    debounce?: number
    pressDisabled?: boolean
    onPress?: (event: React.MouseEventHandler<T>) => void
    animated?: boolean
    animatedProps?: Partial<MotionProps>
    ref?: RefObject<HTMLParagraphElement | null>
  }
