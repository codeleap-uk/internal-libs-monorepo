import { AnimationProps, MotionProps } from 'framer-motion'
import { AnyRecord, StyledProp } from '@codeleap/styles'
import { ViewComposition } from './styles'
import { ComponentPropsWithRef, ElementType } from 'react'

export type ViewProps<T extends ElementType = 'div'> =
  Omit<ComponentPropsWithRef<T>, 'style'> &
  Omit<AnimationProps, 'style'> &
  {
    component?: ElementType<AnyRecord>
    debugName?: string
    is?: any
    not?: any
    up?: any
    down?: any
    onHover?: (isMouseOverElement: boolean) => void
    animated?: boolean
    animatedProps?: Partial<MotionProps>
    style?: StyledProp<ViewComposition>
    children?: React.ReactNode
  }
