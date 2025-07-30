import { AnyRef, MobileInputFile } from '@codeleap/types'
import { Options } from 'react-native-image-crop-picker'
import { AlertOptions } from '@codeleap/modals'

export type FileInputImageSource = 'camera' | 'library' | 'fs'

export type FileResult = MobileInputFile | string | number

export type FileInputRef = {
  openFilePicker: (source?: FileInputImageSource, options?: Partial<Options>) => Promise<FileResult[]>
}

export type FileInputProps = {
  mode: 'hidden' | 'button'
  onFileSelect?: (files: FileResult[]) => void
  ref?: AnyRef<FileInputRef>
  type?: 'image' | 'anyFile'
  alertProps?: AlertOptions & {}
  pickerOptions?: Partial<Options>
  required?: boolean
  onOpenFileSystem?: (resolve: (() => void)) => Promise<void>
  onOpenGallery?: (resolve: (() => void)) => Promise<void>
}