import { StyledProp } from '@codeleap/styles'
import { FileInputProps } from '../FileInput'
import { CropPickerComposition } from './styles'
import { ReactCropProps } from 'react-image-crop'
import { ModalProps } from '../Modal'
import { useCropPicker } from '../../lib'
import { ButtonProps } from '../Button'

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
  }

export type ImageReading = HTMLImageElement
