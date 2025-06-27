import { AnyRef, MobileInputFile } from '@codeleap/types'
import { DocumentPickerOptions } from 'react-native-document-picker'
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
  options?: DocumentPickerOptions
  ref?: AnyRef<FileInputRef>
  type?: 'image' | 'anyFile'
  alertProps?: AlertOptions & {}
  pickerOptions?: Partial<Options>
  required?: boolean
  onOpenFileSystem?: (resolve: (() => void)) => Promise<void>
  onOpenGallery?: (resolve: (() => void)) => Promise<void>
  onError?: (error: any) => void
}