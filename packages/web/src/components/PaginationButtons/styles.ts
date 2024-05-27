import { ButtonComposition, createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type PaginationButtonsComposition =
    'wrapper' |
    `button${Capitalize<ButtonComposition>}` |
    `arrowLeftButton${Capitalize<ButtonComposition>}` |
    `arrowRightButton${Capitalize<ButtonComposition>}`

const createPaginationButtonStyle = createDefaultVariantFactory<PaginationButtonsComposition>()

export const PaginationButtonPresets = includePresets(style => createPaginationButtonStyle(() => ({ wrapper: style })))
