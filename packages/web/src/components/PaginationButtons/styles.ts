import { ButtonComposition, createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ListComposition } from '../List'

export type PaginationButtonsComposition = 'wrapper' | `list${Capitalize<ListComposition>}` | `button${Capitalize<ButtonComposition>}`

const createPaginationButtonStyle = createDefaultVariantFactory<PaginationButtonsComposition>()

export const PaginationButtonPresets = includePresets(style => createPaginationButtonStyle(() => ({ wrapper: style })))
