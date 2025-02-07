import { AnyRef } from '@codeleap/types'
import { FormTypes } from '@codeleap/form'
import { DocumentPickerOptions } from 'react-native-document-picker'
import { Options } from 'react-native-image-crop-picker'
import { OSAlert } from '../../utils'

export type FileInputImageSource = 'camera' | 'library' | 'fs'

export type FileResult = FormTypes.AnyFile

export type FileInputRef = {
  openFilePicker: (source?: FileInputImageSource, options?: Partial<Options>) => Promise<FileResult[]>
}

export type FileInputProps = {
  mode: 'hidden' | 'button'
  onFileSelect?: (files: FileResult[]) => void
  options?: DocumentPickerOptions
  ref?: AnyRef<FileInputRef>
  type?: 'image' | 'anyFile'
  alertProps?: Parameters<typeof OSAlert.ask>[0]
  pickerOptions?: Partial<Options>
  required?: boolean
  onOpenCamera?: (resolve: (() => void)) => Promise<void>
  onOpenFileSystem?: (resolve: (() => void)) => Promise<void>
  onOpenGallery?: (resolve: (() => void)) => Promise<void>
  onError?: (error: any) => void
}
