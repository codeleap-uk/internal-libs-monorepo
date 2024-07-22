import { StyledProp } from '@codeleap/styles'
import { MotionProps } from 'framer-motion'
import { CollapseComposition } from './styles'

export type CollapseProps =
  Omit<MotionProps, 'style'> &
  {
    open: boolean
    style?: StyledProp<CollapseComposition>
    children?: React.ReactNode
  }
