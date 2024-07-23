import { StyledProp } from '@codeleap/styles'
import { FlatListProps, AugmentedRenderItemInfo, ListItem } from '../List'
import { GridComposition } from './styles'

export type GridAugmentedRenderItemInfo<T> =
  AugmentedRenderItemInfo<T> &
  {
    isFirstInRow: boolean
    isLastInRow: boolean
    isOnlyInRow: boolean
  }

export type GridProps<T extends ListItem = ListItem> =
  Omit<FlatListProps<T>, 'style' | 'renderItem'> &
  {
    spacing?: number
    itemDimension?: number
    renderItem: (data: GridAugmentedRenderItemInfo<T>) => React.ReactElement
    style?: StyledProp<GridComposition>
  }
