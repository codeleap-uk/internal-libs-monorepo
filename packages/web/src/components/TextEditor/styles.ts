export type TextEditorStates = 'error' | 'disabled'

export type TextEditorParts = 'wrapper' | 'editor' | 'floatingMenu' | 'bubbleMenu' | 'bubbleMenuInnerWrapper' | 'floatingMenuInnerWrapper' | 'errorMessage'

export type TextEditorComposition = `${TextEditorParts}:${TextEditorStates}` | TextEditorParts
