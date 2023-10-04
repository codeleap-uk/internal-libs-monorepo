import { ComponentVariants } from '@codeleap/common'
import { FileInputProps, FileInputRef } from '../FileInput'
import { CropPickerComposition, CropPickerPresets } from './styles'
import { StylesOf } from '../../types'
import { ReactCropProps } from 'react-image-crop'
import { ModalProps } from '../Modal'

export type CropPickerProps = Partial<FileInputProps> &
  ComponentVariants<typeof CropPickerPresets> & {
    styles?: StylesOf<CropPickerComposition>
    style?: React.CSSProperties
    targetCrop?: Partial<ReactCropProps>
    modalProps?: Partial<ModalProps>
    title?: string
    confirmButton?: string
  }

export type ImageReading = HTMLImageElement

export type useCropPickerProps = Partial<ReactCropProps> & {
  onFileSelect: FileInputProps['onFileSelect']
  ref: React.MutableRefObject<FileInputRef> | React.Ref<FileInputRef>
}
