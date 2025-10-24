import { RefObject } from 'react'
import { AnyFunction } from '@codeleap/types'
import { StyledProp } from '@codeleap/styles'
// import { BubbleMenuProps, Editor, FloatingMenuProps } from '@tiptap/react'
import { FileInputRef } from '../FileInput'
import { TextEditorComposition } from './styles'
import { Validator } from '@codeleap/form'

export type TextEditorProps = React.PropsWithChildren<{
  editor: any & {
    getText: AnyFunction
    isEditable: boolean
    on: AnyFunction
    off: AnyFunction
  }
  style?: StyledProp<TextEditorComposition>
  bubbleMenuProps?: any & { renderContent: React.ReactNode }
  floatingMenuProps?: any & { renderContent: React.ReactNode }
  toolbarComponent?: React.ReactElement
  fileInputRef?: RefObject<FileInputRef>
  validate?: Validator<string, any, any>
}>
