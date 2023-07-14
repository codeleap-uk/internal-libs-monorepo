import { ComponentVariants, StylesOf } from '@codeleap/common'
import { VirtualItem } from '@tanstack/react-virtual'
import { ComponentCommonProps } from '../../types'
import { AugmentedRenderItemInfo, ListProps } from '../List'
import { GridComposition, GridPresets } from './styles'

type GridAugmentedRenderItemInfo<T> = AugmentedRenderItemInfo<T> & {
  column: VirtualItem
  isLastInRow: boolean
  isOnlyInRow: boolean
  isFirstInRow: boolean
  rowIndex: number
}

export type GridProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = 
  Omit<ListProps<T, Data>, 'variants' | 'styles' | 'renderItem'> &
  ComponentVariants<typeof GridPresets> &  {
    styles?: StylesOf<GridComposition>
    numColumns?: number
    renderItem: (data: GridAugmentedRenderItemInfo<T>) => React.ReactElement
  } & ComponentCommonProps
