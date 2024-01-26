import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type TextEditorComposition = 'wrapper' | 'floatingMenu' | 'bubbleMenu' | 'bubbleMenuInnerWrapper' | 'floatingMenuInnerWrapper'

const createTextEditorStyle = createDefaultVariantFactory<TextEditorComposition>()

export const TextEditorPresets = includePresets((styles) => createTextEditorStyle(() => ({ wrapper: styles })))
