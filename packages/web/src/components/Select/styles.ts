import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type SelectParts =
  | 'wrapper'
  | 'label'
  | 'inputWrapper'
  | 'list'
  | 'itemWrapper'
  | 'itemWrapper:selected'
  | 'itemText'
  | 'itemText:selected'
  | 'buttonWrapper'
  | 'buttonText'
  | 'buttonIcon'
  | 'errorText'

export type SelectComposition =
  | `${SelectParts}:hover`
  | `${SelectParts}:open`
  | `${SelectParts}:error`
  | `${SelectParts}:disabled`
  | SelectParts

const createSelectStyle = createDefaultVariantFactory<SelectComposition>()

export const SelectPresets = includePresets((styles) => createSelectStyle(() => ({ wrapper: styles })),
)

