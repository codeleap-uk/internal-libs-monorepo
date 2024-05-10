import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ListComposition } from '../List'

export type PaginationButtonsComposition =
  | 'wrapper'
  | 'itemWrapper'
  | 'itemWrapper:selected'
  | 'text'
  | 'text:selected'
  | 'text:hover'
  | `list${Capitalize<ListComposition>}`

const createPaginationButtonStyle = createDefaultVariantFactory<PaginationButtonsComposition>()

export const PaginationButtonPresets = includePresets(style => createPaginationButtonStyle(() => ({ wrapper: style })))
