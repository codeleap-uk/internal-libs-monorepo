import { StyledProp } from '@codeleap/styles'
import { MotionProps } from 'motion/react'
import { CollapseComposition } from './styles'

export type CollapseProps =
  Omit<MotionProps, 'style'> &
  {
    open: boolean
    style?: StyledProp<CollapseComposition>
    children?: React.ReactNode
  }
