import {
  ComponentVariants,
  IconPlaceholder,
  PropsOf,
  StylesOf,
} from '@codeleap/common'
import { DropzoneComposition, DropzonePresets } from './styles'
import { View } from '../View'
import {
  DropzoneOptions,
  FileRejection,
  DropzoneRef as ReactDropzoneRef,
} from 'react-dropzone'
import { ReactDispatch } from 'react'

export type DropzoneFile = File

export type DropzoneFileRejection = FileRejection

export type DropzoneProps = ComponentVariants<typeof DropzonePresets> &
  DropzoneOptions & {
    styles?: StylesOf<DropzoneComposition>
    style?: PropsOf<typeof View>['style']
    icon?: IconPlaceholder
    placeholder?: string
    acceptedFiles: File[]
    rejectedFiles?: DropzoneFileRejection[]
    setAcceptedFiles: ReactDispatch<React.SetStateAction<DropzoneFile[]>>
    setRejectedFiles?: ReactDispatch<React.SetStateAction<DropzoneFileRejection[]>>
    onRemove?: (file: DropzoneFile) => void
    children?: React.ReactNode
  }

export type DropzoneFilePreviewProps = {
  file: DropzoneFile
  errors?: DropzoneFileRejection['errors']
  variantStyles: StylesOf<DropzoneComposition>
  onRemove?: () => void
}

export type DropzoneRef = ReactDropzoneRef & {
  clear: () => void
}
