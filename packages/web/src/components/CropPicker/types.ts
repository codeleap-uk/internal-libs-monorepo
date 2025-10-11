import { StyledProp } from '@codeleap/styles'
import { FileInputProps, FileInputRef } from '../FileInput'
import { CropPickerComposition } from './styles'
import { ReactCropProps } from 'react-image-crop'
import { ModalProps } from '../Modal'
import { useCropPicker } from '../../lib'
import { ButtonProps } from '../Button'
import { RefObject } from 'react'

export type BaseCropProps = Partial<ReactCropProps>

export type CropPickerProps =
  Partial<FileInputProps> &
  {
    style?: StyledProp<CropPickerComposition>
    targetCrop?: BaseCropProps
    modalProps?: Partial<ModalProps>
    title?: string
    confirmButton?: string
    debugName: string
    handle?: ReturnType<typeof useCropPicker>
    withLoading?: boolean
    confirmButtonProps?: Partial<ButtonProps>
    ref?: RefObject<FileInputRef | null>
  }

export type ImageReading = HTMLImageElement
