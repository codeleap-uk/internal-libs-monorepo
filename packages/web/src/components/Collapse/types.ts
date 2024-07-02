import { PropsOf } from '@codeleap/common'
import { StyledProp } from '@codeleap/styles'
import { View } from '../View'
import { CollapseComposition } from './styles'

export type CollapseAxis = 'horizontal' | 'vertical'

export type GetCollapseStylesArgs = {
  direction?: CollapseAxis
  value: string | number
  animation?: string
  scroll?: boolean
}

export type CollapseProps =
  PropsOf<typeof View, 'style'> &
  {
    open: boolean
    scroll?: boolean
    size?: string | number
    direction?: CollapseAxis
    animation?: string
    style?: StyledProp<CollapseComposition>
    children?: React.ReactNode
  }
