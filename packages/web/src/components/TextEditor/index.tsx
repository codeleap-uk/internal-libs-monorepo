import { useCallback, useDefaultComponentStyle } from '@codeleap/common'
import { BubbleMenu, FloatingMenu, EditorContent } from '@tiptap/react'
import { FileInput, View } from '../components'
import { TextEditorProps } from './types'
import { TextEditorPresets } from './styles'

export * from './styles'
export * from './types'

export const TextEditor = (props: TextEditorProps) => {
  const {
    children,
    editor,
    variants = [],
    styles = {},
    responsiveVariants = {},
    style = {},
    bubbleMenuProps,
    floatingMenuProps,
    toolbarComponent,
    fileInputRef,
  } = props
  const variantStyles = useDefaultComponentStyle<'u:TextEditor', typeof TextEditorPresets>('u:TextEditor', {
    variants,
    styles,
    responsiveVariants,
  })

  const _BubbleMenu = useCallback(() => {
    return (
      <BubbleMenu css={[variantStyles.bubbleMenu]} {...bubbleMenuProps} editor={editor}>
        <View style={variantStyles.bubbleMenuInnerWrapper}>
          {bubbleMenuProps?.renderContent}
        </View>
      </BubbleMenu>
    )
  }, [editor])

  const _FloatingMenu = useCallback(() => {
    return (
      <FloatingMenu css={[variantStyles.floatingMenu]} {...floatingMenuProps} editor={editor}>
        <View style={variantStyles.floatingMenuInnerWrapper}>
          {floatingMenuProps?.renderContent}
        </View>
      </FloatingMenu>
    )
  }, [editor])

  if (!editor) return null
  return (
    <View style={{ ...variantStyles.wrapper, ...style }}>
      {toolbarComponent}
      {children}
      <_BubbleMenu/>
      <_FloatingMenu/>
      <EditorContent editor={editor}/>
      <FileInput
        ref={fileInputRef}
      />
    </View>
  )
}
