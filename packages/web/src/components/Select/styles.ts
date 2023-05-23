import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type SelectParts =
  | 'selectWrapper'
  | 'wrapper'
  | 'innerWrapper'
  | 'inputWrapper'
  | 'label'
  | 'listWrapper'
  | 'list'
  | 'listPortal'
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
  | 'noItems'
  | 'iconsWrapper'
  | 'clearIcon'
  | 'dropdownIcon'
  | 'loadingIcon'
  | 'separatorIcon'
  | 'placeholder'

export type SelectComposition =
  | `${SelectParts}:error`
  | `${SelectParts}:disabled`
  | `${SelectParts}:focused`
  | SelectParts

const createSelectStyle = createDefaultVariantFactory<SelectComposition>()

export const SelectPresets = includePresets((styles) => createSelectStyle(() => ({ wrapper: styles })),
)

