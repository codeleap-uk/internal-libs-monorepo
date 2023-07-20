import React, { forwardRef, useImperativeHandle } from 'react'
import { DocumentPicker, ImageCropPicker } from '../../modules/documentPicker'
import {
  MobileInputFile,
  parseFilePathData,
  useCodeleapContext,
  MobileFile,
} from '@codeleap/common'
import { OSAlert } from '../../utils'
import { ImageOrVideo, Options } from 'react-native-image-crop-picker'
import { DocumentPickerOptions } from '../../modules/types/documentPicker'

export * from './styles'

export type FileInputRef = {
  openFilePicker: (string?: 'camera' | 'library') => void
}

export type FileInputProps = {
  mode: 'hidden' | 'button'
  onFileSelect(files: MobileInputFile<ImageOrVideo>[]): void
  options?: DocumentPickerOptions<any>

  ref?: FileInputRef

  type?: 'image' | 'anyFile'
  alertProps?: Parameters<typeof OSAlert.ask>[0]
  pickerOptions?: Partial<Options>
  required?: boolean
  onOpenCamera?: (resolve: (() => void)) => Promise<void>
  onOpenFileSystem?: (resolve: (() => void)) => Promise<void>
  onOpenGallery?: (resolve: (() => void)) => Promise<void>
  onError?: (error: any) => void
}

const pickerDefaults = {
  cropping: true,
}

function parsePickerData(data:ImageOrVideo):MobileInputFile<ImageOrVideo> {

  const filePathData = parseFilePathData(data.path)
  const d:MobileFile = {
    ...data,
    name: filePathData.name,
    size: data.size,
    type: data.mime,
    uri: data.path,
    fileCopyUri: data.path,
  }

  return {
    file: d,
    preview: data.path,
  }
}

export const FileInput = forwardRef<
  FileInputRef,
  FileInputProps
>((fileInputProps, ref) => {
  const {

    onFileSelect,

    options,
    type = 'image',
    alertProps,

    pickerOptions,

    onOpenCamera = null,
    onOpenGallery = null,
    onOpenFileSystem = null,
    onError,
  } = fileInputProps

  const { logger } = useCodeleapContext()

  async function openFileSystem() {
    try {
      let files = await DocumentPicker.pick(options)
      if (!Array.isArray(files)) {
        files = [files]
      }

      onFileSelect(files.map((file) => ({ preview: file.uri, file })))
    } catch (err) {
      handleError(err)
    }
  }

  function handleError(err) {

    logger.warn('File Input Error', err, 'FILE INPUT')
    onError?.(err)

  }

  const mergedOptions = {
    ...pickerDefaults,
    ...pickerOptions,
  } as Options

  const handlePickerResolution = (data: ImageOrVideo | ImageOrVideo[]) => {
    let imageArray:ImageOrVideo[] = []
    if (!Array.isArray(data)) {
      imageArray = [data]
    } else {
      imageArray = data
    }
    onFileSelect(imageArray.map(parsePickerData))
  }
  const onPress = (open?: 'camera' | 'library' | 'fs', options?: Options) => {
    if (open == 'fs') {
      openFileSystem()
    } else {
      const call = open === 'camera' ? 'openCamera' : 'openPicker'
      ImageCropPicker[call]({ ...mergedOptions, ...(options || {}) }).then(handlePickerResolution)
    }
  }
  const openFilePicker = async (imageSource = null) => {
    if (type === 'image') {
      if (imageSource === 'camera') {
        onPress('camera')
      } else if (imageSource === 'library') {
        onPress('library')
      } else {
        OSAlert.ask({
          title: 'Change Image',
          body: 'Do you want to take a new picture or select an existing one?',
          ...alertProps,
          options: [
            {
              text: alertProps?.options?.[0]?.text || 'Camera',
              onPress: () => {
                if (onOpenCamera) {
                  onOpenCamera(() => onPress('camera'))
                } else {
                  onPress('camera')
                }
              },
              ...alertProps?.options?.[1],
            },
            {
              text: 'Library',
              onPress: () => {
                if (onOpenGallery) {
                  onOpenGallery(() => onPress('library'))
                } else {
                  onPress('library')
                }
              },
              ...alertProps?.options?.[2],
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {},
              ...alertProps?.options?.[0],
            },
          ],
        })
      }
    } else {
      if (onOpenFileSystem) {
        onOpenFileSystem(() => onPress('fs'))
      } else {

        onPress('fs')
      }
    }

  }

  useImperativeHandle(ref, () => ({
    openFilePicker,
  }))

  return null
})
