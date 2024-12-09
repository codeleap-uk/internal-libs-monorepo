import { StylesOf } from '@codeleap/types'
import { DropzoneComposition } from './styles'
import { DropzoneOptions, FileRejection, DropzoneRef as ReactDropzoneRef } from 'react-dropzone'
import { ActionIconComposition } from '../ActionIcon'
import { AppIcon, StyledProp } from '@codeleap/styles'

export type DropzoneFile = File

export type DropzoneFileRejection = FileRejection

export type DropzoneProps =
  Omit<DropzoneOptions, 'style'> &
  {
    style?: StyledProp<DropzoneComposition>
    icon?: AppIcon
    placeholder?: string
    acceptedFiles: File[]
    rejectedFiles?: DropzoneFileRejection[]
    setAcceptedFiles: React.Dispatch<React.SetStateAction<DropzoneFile[]>>
    setRejectedFiles?: React.Dispatch<React.SetStateAction<DropzoneFileRejection[]>>
    onRemove?: (file: DropzoneFile) => void
    children?: React.ReactNode
    fileRightIcon?: AppIcon
    fileLeftIcon?: AppIcon
    withImagePreview?: boolean
    FilePreviewComponent?: (props: DropzoneInnerFilePreviewProps) => JSX.Element
  }

export type DropzoneFilePreviewProps =
  Pick<DropzoneProps, 'fileRightIcon' | 'fileLeftIcon' | 'withImagePreview' | 'FilePreviewComponent'> &
  {
    file: DropzoneFile
    errors?: DropzoneFileRejection['errors']
    styles: StylesOf<DropzoneComposition>
    onRemove?: () => void
    fileRightIconStyles?: StylesOf<ActionIconComposition>
    index?: number
  }

export type DropzoneInnerFilePreviewProps =
  DropzoneFilePreviewProps &
  {
    hasErrors: boolean
    revokeImageUrl: () => void
    imageUrl: string
    isPreview: boolean
  }

export type DropzoneRef = ReactDropzoneRef & {
  clear: () => void
}
