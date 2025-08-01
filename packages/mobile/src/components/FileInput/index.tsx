import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { MobileFile } from '@codeleap/types'
import { parseFilePathData } from '@codeleap/utils'
import ImageCropPicker, { ImageOrVideo, Options } from 'react-native-image-crop-picker'
import { FileInputImageSource, FileInputProps, FileInputRef, FileResult } from './types'
import { alert } from '@codeleap/modals'

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
    type = 'image',
    pickerOptions,
    onOpenGallery = null,
    onOpenFileSystem = null,
    alertProps,
  } = {
    ...fileInputProps,
    ...FileInput.defaultProps,
  }

  const resolveWithFile = useRef<(file: FileResult[]) => any>()

  const handleResolve = (files: Array<FileResult>) => {
    if (resolveWithFile.current) {
      resolveWithFile?.current?.(files)
      resolveWithFile.current = null
    }
    onFileSelect?.(files)
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
      // openFileSystem()
    } else {
      const call = open === 'camera' ? 'openCamera' : 'openPicker'
      ImageCropPicker[call]({ ...mergedOptions, ...(options || {}) }).then(handlePickerResolution)
    }
  }

  const openFilePicker = async (imageSource = null, options = {}) => {
    if (type === 'image') {
      if (imageSource === 'camera') {
        onPress('camera', options)
      } else if (imageSource === 'library') {
        onPress('library', options)
      } else {
        alert.ask({
          title: 'Change Image',
          body: 'Do you want to take a new picture or select an existing one?',
          ...alertProps,
          options: [
            {
              text: 'Library',
              onPress: () => {
                if (onOpenGallery) {
                  onOpenGallery(() => onPress('library'))
                } else {
                  onPress('library')
                }
              },
              ...alertProps?.options?.[0],
            },
            {
              text: 'Cancel',
              style: 'cancel',
              ...alertProps?.options?.[1]
            },
          ]
        })
      }
    } else {
      if (onOpenFileSystem) {
        // onOpenFileSystem(() => onPress('fs'))
      } else {
        onPress('fs')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    openFilePicker: (imageSource: FileInputImageSource = null, options: Partial<Options> = {}) => {
      openFilePicker(imageSource, options)
      return new Promise<FileResult[]>((resolve) => {
        resolveWithFile.current = resolve
      })
    },
  }))

  return null
})

export const FileInput = _FileInput as unknown as ((props: FileInputProps) => JSX.Element) & { defaultProps: Partial<FileInputProps> }

FileInput.defaultProps = {}

export const useFileInput = () => {
  const inputRef = useRef<FileInputRef>(null)

  const openFilePicker = (imageSource: FileInputImageSource = null, options: Partial<Options> = {}): Promise<FileResult[]> => {
    return inputRef.current?.openFilePicker(imageSource, options)
  }

  return {
    openFilePicker,
    ref: inputRef as React.MutableRefObject<FileInputRef>,
  }
}