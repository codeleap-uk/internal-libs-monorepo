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
  openFilePicker: () => void;
};

export type FileInputProps = {
  label?: string;
  iconName?: IconPlaceholder;
  styles?: StylesOf<FileInputComposition>;
  mode: 'hidden' | 'button';
  variants?: ComponentVariants<typeof FileInputStyles>['variants'];
  onFileSelect(files: MobileInputFile[]): void;
  options?: DocumentPickerOptions<any>;
  buttonProps?: ButtonProps;
  ref?: FileInputRef;
  placeholder?: string
  type?: 'image' | 'anyFile'
  alertProps?: Parameters<typeof OSAlert.ask>[0]
  pickerOptions?: Partial<Options>
};

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
    buttonProps,
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
      if (DocumentPicker.isCancel(err)) {
        logger.log('User cancelled the picker.', null, 'Component')
      } else {
        throw err
      }
    }
  }

  const mergedOptions  = {
    ...pickerDefaults,
    ...pickerOptions,
  } as Options

  const handlePickerResolution = data => {
    onFileSelect(mergedOptions.multiple ? data.map(parsePickerData)  : [
      parsePickerData(data),
    ])
  }

  const openFilePicker = async () => {

    if (type === 'image') {
      OSAlert.ask({
        title: 'Change Image',
        body: 'Do you want to take a new picture or select an existing one?',
        ...alertProps,
        options: [
          {
            text: 'Cancel',
            onPress: () => {},
            ...alertProps?.options[0],
          },
          {
            text: alertProps?.options?.[0]?.text || 'Camera',
            onPress: () => {
              ImageCropPicker.openCamera(mergedOptions).then(handlePickerResolution)
            },
            ...alertProps?.options[1],
          },
          {
            text: 'Library',
            onPress: () => {
              ImageCropPicker.openPicker(mergedOptions).then(handlePickerResolution)

            },
            ...alertProps?.options[2],
          },

        ],
      })
    } else {
      openFileSystem()
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
        <InputLabel label={label} style={variantStyles.label} />
        <Button
          onPress={() => openFilePicker()}
          text={filenames || placeholder}
          icon={iconName || ('fileInputButton' as IconPlaceholder)}
          variants={filenames ? '' : 'icon'}
          {...buttonProps}
        />
      </View>
    )
  }

  return null
})
