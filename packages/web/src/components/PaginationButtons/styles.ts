import { ButtonComposition } from '../Button'

export type PaginationButtonsComposition =
    'wrapper' |
    `button${Capitalize<ButtonComposition>}` |
    `arrowLeftButton${Capitalize<ButtonComposition>}` |
    `arrowRightButton${Capitalize<ButtonComposition>}`
