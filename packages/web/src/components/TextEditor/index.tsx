import React from 'react'
import { onUpdate, useCallback, useDefaultComponentStyle, useState, useValidate } from '@codeleap/common'
import { BubbleMenu, FloatingMenu, EditorContent } from '@tiptap/react'
import { FileInput, Text, View } from '../components'
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
    _error,
    validate,
  } = props

  const [_isFocused, setIsFocused] = useState(false)
  const validation = useValidate(editor?.getText() ?? '', validate)

  const hasError = !validation.isValid || _error
  const errorMessage = validation.message || _error
  const isDisabled = !editor?.isEditable ?? null

  const variantStyles = useDefaultComponentStyle<'u:TextEditor', typeof TextEditorPresets>('u:TextEditor', {
    variants,
    styles,
    responsiveVariants,
  })

  const handleBlur = React.useCallback(() => {
    validation?.onInputBlurred()
    setIsFocused(false)
  }, [validation?.onInputBlurred])

  const handleFocus = React.useCallback(() => {
    validation?.onInputFocused()
    setIsFocused(true)
  }, [validation?.onInputFocused])

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

  const editorStyles = [
    variantStyles.editor,
    hasError && variantStyles['editor:error'],
    isDisabled && variantStyles['editor:disabled'],
  ]

  if (!editor) return null
  return (
    <View
      css={[
        variantStyles.wrapper,
        hasError && variantStyles['wrapper:error'],
        {
          '.tiptap': editorStyles,
        },
        style,
      ]}
    >
      {toolbarComponent}
      {children}
      <_BubbleMenu />
      <_FloatingMenu />
      <EditorContent editor={editor} />
      {hasError ? <Text text={errorMessage} css={variantStyles['errorMessage:error']} /> : null}
      <FileInput
        ref={fileInputRef}
      />
    </View>
  )
}
