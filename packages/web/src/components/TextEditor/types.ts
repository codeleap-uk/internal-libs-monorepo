import { RefObject } from 'react'
import { AnyFunction } from '@codeleap/types'
import { FormTypes, yup } from '@codeleap/deprecated'
import { StyledProp } from '@codeleap/styles'
import { BubbleMenuProps, Editor, FloatingMenuProps } from '@tiptap/react'
import { FileInputRef } from '../FileInput'
import { TextEditorComposition } from './styles'

export type TextEditorProps = React.PropsWithChildren<{
  editor: Editor & {
    getText: AnyFunction
    isEditable: boolean
    on: AnyFunction
    off: AnyFunction
  }
  style?: StyledProp<TextEditorComposition>
  bubbleMenuProps?: BubbleMenuProps & { renderContent: React.ReactNode }
  floatingMenuProps?: FloatingMenuProps & { renderContent: React.ReactNode }
  toolbarComponent?: JSX.Element
  fileInputRef?: RefObject<FileInputRef>
  _error?: boolean
  validate?: FormTypes.ValidatorWithoutForm<string> | yup.Schema<string>
}>
