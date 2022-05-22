import React, { forwardRef, useImperativeHandle } from 'react'
import { DocumentPicker, ImageCropPicker } from '../modules/documentPicker'
import {
  ComponentVariants,
  FileInputComposition,
  FileInputStyles,
  IconPlaceholder,
  MobileInputFile,
  parseFilePathData,
  useDefaultComponentStyle,
  useCodeleapContext,
} from '@codeleap/common'
import { StylesOf } from '../types/utility'
import { Button, ButtonProps } from './Button'
import { View } from './View'
import { InputLabel } from './TextInput'
import OSAlert from '../utils/OSAlert'
import { Options } from 'react-native-image-crop-picker'
import { DocumentPickerOptions } from '../modules/types/documentPicker'

export type FileInputRef = {
  openFilePicker: (string?: 'camera' | 'library') => void
}

export type FileInputProps = {
  label?: string
  iconName?: IconPlaceholder
  styles?: StylesOf<FileInputComposition>
  mode: 'hidden' | 'button'
  variants?: ComponentVariants<typeof FileInputStyles>['variants']
  onFileSelect(files: MobileInputFile[]): void
  options?: DocumentPickerOptions<any>
  buttonProps?: ButtonProps
  ref?: FileInputRef
  placeholder?: string
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
  width: 300,
  height: 400,
  cropping: true,
}

function parsePickerData(data:any):MobileInputFile {

  const filePathData = parseFilePathData(data.path)
  const d:MobileInputFile['file'] = {
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
    mode = 'hidden',
    onFileSelect,
    iconName,
    styles,
    label,
    variants,
    options,
    type = 'image',
    alertProps,
    placeholder = 'Select a file',
    pickerOptions,
    required,
    buttonProps,
    onOpenCamera = null,
    onOpenGallery = null,
    onOpenFileSystem = null,
    onError,
  } = fileInputProps

  const [file, setFile] = React.useState(null)

  const { logger } = useCodeleapContext()

  async function openFileSystem() {
    try {
      let files = await DocumentPicker.pick(options)
      if (!Array.isArray(files)) {
        files = [files]
      }
      setFile(files)
      onFileSelect(files.map((file) => ({ preview: file.uri, file })))
    } catch (err) {
      handleError(err)
    }
  }

  function handleError(err) {
    const warn = DocumentPicker.isCancel(err) || String(err).includes('Error: User cancelled')
    if (warn) {
      // NOTE yeah, it should not be both of course but just logger.* isn't showing for some reason
      logger.warn(err)
      console.warn(err)
    } else {
      // NOTE yeah, it should not be both of course but just logger.* isn't showing for some reason
      logger.error(err)
      console.warn(err)
      if (onError) {
        onError(err)
      } else {
        OSAlert.error({
          title: 'Error',
          body: err.message,
        })
      }
    }
  }

  const mergedOptions = {
    ...pickerDefaults,
    ...pickerOptions,
  } as Options

  const handlePickerResolution = data => {
    onFileSelect(mergedOptions.multiple ? data.map(parsePickerData) : [
      parsePickerData(data),
    ])
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
              ...alertProps?.options[1],
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
              ...alertProps?.options[2],
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {},
              ...alertProps?.options[0],
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

  const variantStyles = useDefaultComponentStyle('FileInput', {
    styles,
    variants,
  })

  useImperativeHandle(ref, () => ({
    openFilePicker,
  }))

  const filenames = file ? file.map((f) => f.name) : ''
  if (mode === 'button') {
    return (
      <View style={variantStyles.wrapper}>
        <InputLabel label={label} style={variantStyles.label} required={required}/>
        <Button
          onPress={() => openFilePicker()}
          text={filenames || placeholder}
          debugName={'Open file picker'}
          icon={iconName || ('fileInputButton' as IconPlaceholder)}
          variants={filenames ? '' : 'icon'}
          {...buttonProps}
        />
      </View>
    )
  }

  return null
})
