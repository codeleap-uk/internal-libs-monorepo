import { ComponentVariants, StylesOf } from '@codeleap/common'
import { ComponentCommonProps } from '../../types'
import { ListProps } from '../List'
import { GridComposition, GridPresets } from './styles'

export type GridProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = 
  Omit<ListProps<T, Data>, 'variants' | 'styles'> &
  ComponentVariants<typeof GridPresets> &  {
    styles?: StylesOf<GridComposition>
    columnItemsSpacing?: number
    numColumns: number
  } & ComponentCommonProps
