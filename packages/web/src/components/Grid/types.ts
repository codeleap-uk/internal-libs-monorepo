import { StyledProp } from '@codeleap/styles'
import { GridComposition } from './styles'
import { ComponentCommonProps } from '../../types'
import { ListProps } from '../List'

export type GridProps =
  Omit<ListProps, 'style'> &
  ComponentCommonProps &
  {
    style?: StyledProp<GridComposition>
    columnItemsSpacing?: number
    numColumns: number
  }
