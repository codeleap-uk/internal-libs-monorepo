import { RefObject } from 'react'
import { AnyFunction, ComponentVariants, FormTypes, StylesOf, yup } from '@codeleap/common'
import { BubbleMenuProps, Editor, FloatingMenuProps } from '@tiptap/react'
import { FileInputRef } from '../FileInput'
import { TextEditorComposition, TextEditorPresets } from './styles'

export type TextEditorProps = React.PropsWithChildren<{
  editor: Editor & {
    getText: AnyFunction
    isEditable: boolean
    on: AnyFunction
    off: AnyFunction
  }
  styles?: StylesOf<TextEditorComposition>
  style?: React.CSSProperties
  bubbleMenuProps?: BubbleMenuProps & { renderContent: React.ReactNode }
  floatingMenuProps?: FloatingMenuProps & { renderContent: React.ReactNode }
  toolbarComponent?: JSX.Element
  fileInputRef?: RefObject<FileInputRef>
  _error?: boolean
  validate?: FormTypes.ValidatorWithoutForm<string> | yup.SchemaOf<string>
} & ComponentVariants<typeof TextEditorPresets>>
