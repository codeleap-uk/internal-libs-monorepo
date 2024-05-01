import { StyledProp } from '@codeleap/styles'
import { FlatListProps, AugmentedRenderItemInfo } from '../List'
import { GridComposition } from './styles'

export type DataboundFlatGridPropsTypes = 'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'

export type GridAugmentedRenderItemInfo<T> = 
  AugmentedRenderItemInfo<T> & 
  {
    isFirstInRow: boolean
    isLastInRow: boolean
    isOnlyInRow: boolean
  }

export type GridProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = 
  Omit<FlatListProps<T, Data>, 'style' | 'renderItem'> & 
  {
    spacing?: number
    itemDimension?: number
    renderItem: (data: GridAugmentedRenderItemInfo<T>) => React.ReactElement
    style?: StyledProp<GridComposition>
  }
