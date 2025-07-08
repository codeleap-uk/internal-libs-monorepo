import React from 'react'
import { onUpdate, useCallback } from '@codeleap/hooks'
import { BubbleMenu, FloatingMenu, EditorContent } from '@tiptap/react'
import { FileInput, Text, View } from '../components'
import { TextEditorProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useValidate } from '@codeleap/form'

export * from './styles'
export * from './types'

export const TextEditor = (props: TextEditorProps) => {
  const {
    children,
    editor,
    style,
    bubbleMenuProps,
    floatingMenuProps,
    toolbarComponent,
    fileInputRef,
    validate,
  } = {
    ...TextEditor.defaultProps,
    ...props,
  }

  const styles = useStylesFor(TextEditor.styleRegistryName, style)

  const validation = useValidate(editor?.getText() ?? '', validate)

  const isDisabled = !editor?.isEditable ?? null

  const handleBlur = React.useCallback(() => {
    validation?.onInputBlurred()
  }, [validation?.onInputBlurred])

  const handleFocus = React.useCallback(() => {}, [])

  onUpdate(() => {
    editor?.on('blur', handleBlur)
    editor?.on('focus', handleFocus)

    return () => {
      editor?.off('blur', handleBlur)
      editor?.off('focus', handleFocus)
    }
  }, [editor, handleBlur, handleFocus])

  const _BubbleMenu = useCallback(() => {
    return (
      // @ts-expect-error icss type
      <BubbleMenu css={[styles.bubbleMenu]} {...bubbleMenuProps} editor={editor}>
        <View style={styles.bubbleMenuInnerWrapper}>
          {bubbleMenuProps?.renderContent}
        </View>
      </BubbleMenu>
    )
  }, [editor])

  const _FloatingMenu = useCallback(() => {
    return (
      // @ts-expect-error icss type
      <FloatingMenu css={[styles.floatingMenu]} {...floatingMenuProps} editor={editor}>
        <View style={styles.floatingMenuInnerWrapper}>
          {floatingMenuProps?.renderContent}
        </View>
      </FloatingMenu>
    )
  }, [editor])

  const editorStyles = [
    styles.editor,
    validation?.showError && styles['editor:error'],
    isDisabled && styles['editor:disabled'],
  ]

  if (!editor) return null

  return (
    <View
      style={[
        styles.wrapper,
        validation?.showError && styles['wrapper:error'],
        {
          '.tiptap': editorStyles,
        },
      ]}
    >
      {toolbarComponent}
      {children}
      <_BubbleMenu />
      <_FloatingMenu />
      <EditorContent editor={editor} />
      {validation?.showError ? <Text text={validation?.message as string} style={styles['errorMessage:error']} /> : null}
      <FileInput ref={fileInputRef} />
    </View>
  )
}

TextEditor.styleRegistryName = 'TextEditor'

TextEditor.elements = [
  'wrapper',
  'editor',
  'floatingMenu',
  'bubbleMenu',
  'bubbleMenuInnerWrapper',
  'floatingMenuInnerWrapper',
  'errorMessage',
]

TextEditor.rootElement = 'wrapper'

TextEditor.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return TextEditor as (props: StyledComponentProps<TextEditorProps, typeof styles>) => IJSX
}

TextEditor.defaultProps = {} as Partial<TextEditorProps>

WebStyleRegistry.registerComponent(TextEditor)
