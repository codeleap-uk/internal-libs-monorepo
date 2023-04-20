import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { SelectComposition } from '../Select'
import { TextInputComposition } from '../TextInput'

export type AutoCompleteComposition = SelectComposition | `searchInput${Capitalize<TextInputComposition>}` | 'titleWrapper'

const createAutoCompleteStyle = createDefaultVariantFactory<AutoCompleteComposition>()

export const AutoCompletePresets = includePresets((style) => createAutoCompleteStyle(() => ({ body: style })))

