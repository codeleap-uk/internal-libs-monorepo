import { createDefaultVariantFactory } from '@codeleap/common'
import { ListComposition, ListStyles } from '../List'

export type GridComposition = ListComposition

const createGridStyle = createDefaultVariantFactory<GridComposition>()

export const GridStyles = {
  ...ListStyles,

}
