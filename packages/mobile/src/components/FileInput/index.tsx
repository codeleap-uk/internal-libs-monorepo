import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import {
  parseFilePathData,
  useCodeleapContext,
  MobileFile,
  AnyRef,
  FormTypes,
} from '@codeleap/common'
import { OSAlert } from '../../utils'
import ImageCropPicker, { ImageOrVideo, Options } from 'react-native-image-crop-picker'
import DocumentPicker, { DocumentPickerOptions } from 'react-native-document-picker'
export * from './styles'

export const useSomething = useImperativeHandle

type FileInputImageSource = 'camera' | 'library' | 'fs'

type FileResult = FormTypes.AnyFile

export type FileInputRef = {
  openFilePicker: (string?: FileInputImageSource) => Promise<FileResult[]>
}
export type FileInputProps = {
  mode: 'hidden' | 'button'
  onFileSelect?: (files: FileResult[]) => void
  options?: DocumentPickerOptions<any>

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

const pickerDefaults = {
  cropping: true,
}

function parsePickerData(data: ImageOrVideo): FileResult {

  const filePathData = parseFilePathData(data.path)
  const d: MobileFile = {
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

const _FileInput = forwardRef<
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
  const resolveWithFile = useRef<(file: FileResult[]) => any>()
  const { logger } = useCodeleapContext()

  const handleResolve = (files: Array<FileResult>) => {
    if (resolveWithFile.current) {
      resolveWithFile?.current?.(files)
      resolveWithFile.current = null
    }
    onFileSelect?.(files)
  }

  async function openFileSystem() {
    try {
      let files = await DocumentPicker.pick(options)
      if (!Array.isArray(files)) {
        files = [files]
      }

      const filesWithPreview = files.map((file) => ({ preview: file.uri, file })) as FileResult[]

      handleResolve?.(filesWithPreview)
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
    let imageArray: ImageOrVideo[] = []
    if (!Array.isArray(data)) {
      imageArray = [data]
    } else {
      imageArray = data
    }
    handleResolve?.(imageArray.map(parsePickerData))
  }
  const onPress = (open?: FileInputImageSource, options?: Options) => {
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
              onPress: () => { },
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
    openFilePicker: (imageSource: FileInputImageSource = null) => {
      openFilePicker(imageSource)
      return new Promise<FileResult[]>((resolve) => {
        resolveWithFile.current = resolve
      })
    },
  }))

  return null
})

export const FileInput = _FileInput as unknown as ((props: FileInputProps) => JSX.Element)

export const useFileInput = () => {
  const inputRef = useRef<FileInputRef>(null)

  const openFilePicker = (imageSource: FileInputImageSource = null): Promise<FileResult[]> => {
    return inputRef.current?.openFilePicker(imageSource)
  }

  return {
    openFilePicker,
    ref: inputRef as React.MutableRefObject<FileInputRef>,
  }
}
