import { AnyRef, ComponentVariants } from '@codeleap/common'
import { FileInputProps, FileInputRef } from '../FileInput'
import { CropPickerComposition, CropPickerPresets } from './styles'
import { StylesOf } from '../../types'
import { ReactCropProps } from 'react-image-crop'
import { ModalProps } from '../Modal'
import { useCropPicker } from './useCropPicker'
import { ButtonProps } from '../Button'

export type CropImageType = 'png' | 'jpeg' | 'webp'

export type BaseCropProps = Partial<ReactCropProps>

export type CropPickerProps = Partial<FileInputProps> &
  ComponentVariants<typeof CropPickerPresets> & {
    styles?: StylesOf<CropPickerComposition>
    style?: React.CSSProperties
    targetCrop?: BaseCropProps
    modalProps?: Partial<ModalProps>
    title?: string
    confirmButton?: string
    debugName: string
    handle?: ReturnType<typeof useCropPicker>
    ref: AnyRef<HTMLElement>
    withLoading?: boolean
    confirmButtonProps?: Partial<ButtonProps>
  }

export type ImageReading = HTMLImageElement

export type UseCropPickerProps = Partial<ReactCropProps> & {
  onFileSelect: FileInputProps['onFileSelect']
  ref: React.MutableRefObject<FileInputRef> | React.Ref<FileInputRef>
}
