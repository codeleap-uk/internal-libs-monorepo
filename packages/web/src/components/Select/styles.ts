import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type SelectParts =
  | 'wrapper'
  | 'inputWrapper'
  | 'label'
  | 'listWrapper'
  | 'list'
  | 'itemWrapper'
  | 'input'
  | 'inputValue'
  | 'inputMultiValue'
  | 'inputMultiValueRemove'
  | 'inputMultiValueLabel'
  | 'inputValueWrapper'
  | 'itemWrapper:selected'
  | 'item'
  | 'errorText'
  | 'loadingText'
  | 'noItemsText'
  | 'iconsWrapper'
  | 'clearIcon'
  | 'dropdownIcon'
  | 'loadingIcon'
  | 'separatorIcon'
  | 'placeholder'

export type SelectComposition =
  | `${SelectParts}:hover`
  | `${SelectParts}:open`
  | `${SelectParts}:error`
  | `${SelectParts}:disabled`
  | SelectParts

const createSelectStyle = createDefaultVariantFactory<SelectComposition>()

export const SelectPresets = includePresets((styles) => createSelectStyle(() => ({ wrapper: styles })),
)

