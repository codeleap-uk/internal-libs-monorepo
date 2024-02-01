import { RefObject } from 'react'
import { ComponentVariants, StylesOf } from '@codeleap/common'
import { BubbleMenuProps, Editor, FloatingMenuProps } from '@tiptap/react'
import { FileInputRef } from '../FileInput'
import { TextEditorComposition, TextEditorPresets } from './styles'

export type TextEditorProps = React.PropsWithChildren<{
  editor: Editor
  styles?: StylesOf<TextEditorComposition>
  style?: React.CSSProperties
  bubbleMenuProps?: BubbleMenuProps & {renderContent: React.ReactNode}
  floatingMenuProps?: FloatingMenuProps & {renderContent: React.ReactNode}
  toolbarComponent?: JSX.Element
  fileInputRef?: RefObject<FileInputRef>
} & ComponentVariants<typeof TextEditorPresets>>
