import { ButtonComposition } from '@codeleap/common'

export type SectionFiltersComposition =
  'wrapper' |
  'innerWrapper' |
  'label' |
  'optionWrapper' |
  'optionInnerWrapper' |
  `itemOptionButton${Capitalize<ButtonComposition>}` |
  'footerWrapper' |
  `applyButton${Capitalize<ButtonComposition>}` |
  `clearButton${Capitalize<ButtonComposition>}`

