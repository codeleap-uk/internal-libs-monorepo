import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { DocumentPicker } from '../modules/documentPicker'
import {
  ComponentVariants,
  FileInputComposition,
  FileInputStyles,
  IconPlaceholder,
  MobileInputFile,
  useComponentStyle,
  useStyle,
} from '@codeleap/common'
import { StylesOf } from '../types/utility'
import { Button, ButtonProps } from './Button'
import { View } from './View'
import { InputLabel } from './TextInput'

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
  options?: DocumentPicker.DocumentPickerOptions;
  buttonProps?: ButtonProps;
  ref?: FileInputRef;
};

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
    buttonProps,
  } = fileInputProps

  const [file, setFile] = React.useState(null)

  const { logger } = useStyle()

  const openFilePicker = async () => {
    try {
      let files = await DocumentPicker.pick(options)
      if (!Array.isArray(files)) {
        files = [files]
      }
      setFile(files)
      onFileSelect(files.map((file) => ({ preview: file, file })))
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        logger.log('User cancelled the picker.', null, 'Component')
      } else {
        throw err
      }
    }
  }

  const variantStyles = useComponentStyle('FileInput', {
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
          text={filenames}
          icon={iconName || ('fileInputButton' as IconPlaceholder)}
          variants={filenames ? '' : 'icon'}
          {...buttonProps}
        />
      </View>
    )
  }

  return null
})
