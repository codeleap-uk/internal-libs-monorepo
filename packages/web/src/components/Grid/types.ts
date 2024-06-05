import { StyledProp } from '@codeleap/styles'
import { ComponentCommonProps } from '../../types'
import { ListProps } from '../List'
import { GridComposition } from './styles'

export type GridProps = ListProps & {
    style?: StyledProp<GridComposition>
    columnItemsSpacing?: number
    numColumns: number
  } & ComponentCommonProps
