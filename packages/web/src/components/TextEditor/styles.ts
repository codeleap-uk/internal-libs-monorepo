import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type TextEditorStates = 'error' | 'disabled'
export type TextEditorParts = 'wrapper' | 'editor' | 'floatingMenu' | 'bubbleMenu' | 'bubbleMenuInnerWrapper' | 'floatingMenuInnerWrapper' | 'errorMessage'

export type TextEditorComposition = `${TextEditorParts}:${TextEditorStates}` | TextEditorParts

const createTextEditorStyle = createDefaultVariantFactory<TextEditorComposition>()

export const TextEditorPresets = includePresets((styles) => createTextEditorStyle(() => ({
  wrapper: styles,
})))
