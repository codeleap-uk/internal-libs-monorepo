import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { parseFilePathData, MobileFile } from '@codeleap/common'
import { OSAlert } from '../../utils'
import ImageCropPicker, { ImageOrVideo, Options } from 'react-native-image-crop-picker'
import DocumentPicker from 'react-native-document-picker'
import { FileInputImageSource, FileInputProps, FileInputRef, FileResult } from './types'

export * from './types'

const pickerDefaults = {
  cropping: true,
}

function parsePickerData(data: ImageOrVideo): FileResult {
  const filePathData = parseFilePathData(data.path)

  const file: MobileFile = {
    ...data,
    name: filePathData.name,
    size: data.size,
    type: data.mime,
    uri: data.path,
    fileCopyUri: data.path,
  }

  return {
    file,
    preview: data.path,
  }
}

const _FileInput = forwardRef<FileInputRef, FileInputProps>((fileInputProps, ref) => {
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
