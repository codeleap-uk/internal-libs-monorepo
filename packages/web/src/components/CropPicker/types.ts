import { StyledProp } from '@codeleap/styles'
import { FileInputProps } from '../FileInput'
import { CropPickerComposition } from './styles'
import { ReactCropProps } from 'react-image-crop'
import { ModalProps } from '../Modal'
import { useCropPicker } from '../../lib'

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
  }

export type ImageReading = HTMLImageElement
