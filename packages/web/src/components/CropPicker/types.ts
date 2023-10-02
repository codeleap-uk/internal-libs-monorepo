import { ComponentVariants } from '@codeleap/common'
import { FileInputProps } from '../FileInput'
import { CropPickerPresets } from './styles'

export type CropPickerProps = Partial<FileInputProps> &
  ComponentVariants<typeof CropPickerPresets> & {
    // targetCrop?: Partial<ReactCropProps>
  }
