import { ButtonComposition, createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type SectionFiltersComposition =
  'wrapper' |
  'headerWrapper' |
  'headerTitle' |
  'innerWrapper' |
  'labelWrapper' |
  'label' |
  'description' |
  'optionWrapper' |
  'optionInnerWrapper' |
  `itemOptionButton${Capitalize<ButtonComposition>}` |
  'itemLabelWrapper' |
  'itemLabel' |
  'footerWrapper' |
  `applyButton${Capitalize<ButtonComposition>}` |
  `clearButton${Capitalize<ButtonComposition>}`

const createSectionFiltersStyle = createDefaultVariantFactory<SectionFiltersComposition>()

export const SectionFilterPresets = includePresets((styles) => createSectionFiltersStyle(() => ({ wrapper: styles })))
