import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type SectionFiltersComposition =
  'wrapper' |
  'headerWrapper' |
  'headerTitle' |
  'scroll' |
  'label' |
  'description' |
  'itemWrapper' |
  'itemWrapper:hover' |
  'itemWrapper:selected' |
  'itemLabelWrapper' |
  'itemLabel' |
  'itemLabel:selected' |
  'footerButton'

const createSectionFiltersStyle = createDefaultVariantFactory<SectionFiltersComposition>()

export const SectionFilterPresets = includePresets((styles) => createSectionFiltersStyle(() => ({ wrapper: styles })))
