import { RefObject } from 'react'
import { AnyFunction } from '@codeleap/types'
import { StyledProp } from '@codeleap/styles'
import { BubbleMenuProps, Editor, FloatingMenuProps } from '@tiptap/react'
import { FileInputRef } from '../FileInput'
import { TextEditorComposition } from './styles'
import { Validator } from '@codeleap/form'

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
  validate?: Validator<string, any, any>
}>
