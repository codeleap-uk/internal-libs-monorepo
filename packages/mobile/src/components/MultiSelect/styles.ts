import { createDefaultVariantFactory } from '@codeleap/common'
import { SelectComposition, SelectStyles } from '../Select'
type ItemStates = '' | ':selected'
export type MultiSelectComposition =
  SelectComposition | `itemIcon${ItemStates}`

const createMultiSelectStyle = createDefaultVariantFactory<MultiSelectComposition>()

export const MultiSelectStyles = {
  ...SelectStyles,
  default: createMultiSelectStyle((theme) => {
    const defaultStyle = SelectStyles.default(theme)
    return {
      ...defaultStyle,

    }
  }),
}
