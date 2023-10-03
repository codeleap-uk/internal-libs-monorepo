import { ComponentVariants } from '@codeleap/common'
import { FileInputProps } from '../FileInput'
import { CropPickerComposition, CropPickerPresets } from './styles'
import { StylesOf } from '../../types'
import { ReactCropProps } from 'react-image-crop'

export type CropPickerProps = Partial<FileInputProps> &
  ComponentVariants<typeof CropPickerPresets> & {
    styles?: StylesOf<CropPickerComposition>
    style?: React.CSSProperties
    targetCrop?: Partial<ReactCropProps>
  }
