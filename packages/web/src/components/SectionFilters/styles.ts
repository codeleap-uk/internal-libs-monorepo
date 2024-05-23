import { ButtonComposition, createDefaultVariantFactory, includePresets } from '@codeleap/common'

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

const createSectionFiltersStyle = createDefaultVariantFactory<SectionFiltersComposition>()

export const SectionFilterPresets = includePresets((styles) => createSectionFiltersStyle(() => ({ wrapper: styles })))
