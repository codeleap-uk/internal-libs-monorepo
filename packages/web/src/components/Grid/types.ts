import { StyledProp } from '@codeleap/styles'
import { GridComposition } from './styles'
import { ComponentCommonProps } from '../../types'
import { ListItem, ListProps } from '../List'

export type GridProps<T extends ListItem = ListItem> =
  Omit<ListProps<T>, 'style'> &
  ComponentCommonProps &
  {
    style?: StyledProp<GridComposition>
    columnItemsSpacing?: number
    numColumns?: number
  }
