import { ComponentCommonProps } from '../../types'
import { ListProps } from '../List'

export type GridProps = ListProps & {
    columnItemsSpacing?: number
    numColumns: number
  } & ComponentCommonProps
