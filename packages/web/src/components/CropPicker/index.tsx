import React, { forwardRef } from 'react'
import {
  getNestedStylesByKey,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { CropPickerPresets } from './styles'
import { CropPickerProps } from './types'
import { useCropPicker } from './useCropPicker'
import { Modal, Button, FileInput, FileInputRef } from '../components'

const ReactCrop: React.Component = require('react-image-crop').Component
import 'react-image-crop/dist/ReactCrop.css'

export * from './styles'
export * from './types'
export * from './utils'
export * from './useCropPicker'

export const _CropPicker = forwardRef<FileInputRef, CropPickerProps>(
  (props: CropPickerProps, ref) => {
    const {
      onFileSelect,
      targetCrop,
      variants = [],
      responsiveVariants = {},
      styles = {},
      modalProps = {},
      title = 'Crop Image',
      confirmButton = 'Confirm Crop',
      debugName,
      handle,
      ...fileInputProps
    } = props

    const {
      onConfirmCrop,
      onFilesReturned,
      onClose,
      fileInputRef,
      visible,
      image,
      crop,
      setRelativeCrop,
      handleCropChange,
    } = handle || useCropPicker({ onFileSelect, ref, ...targetCrop })

    const variantStyles = useDefaultComponentStyle<
      'u:CropPicker',
      typeof CropPickerPresets
    >('u:CropPicker', {
      variants,
      responsiveVariants,
      styles,
    })

    const buttonStyles = getNestedStylesByKey('confirmButton', variantStyles)
    const modalStyles = getNestedStylesByKey('modal', variantStyles)

    return (
      <>
        <FileInput
          ref={fileInputRef}
          onChange={(files) => onFilesReturned(files)}
          {...fileInputProps}
        />
        <Modal
          visible={visible}
          toggle={onClose}
          title={title}
          styles={modalStyles}
          footer={
            <Button
              text={confirmButton}
              styles={buttonStyles}
              onPress={onConfirmCrop}
              debugName={debugName}
            />
          }
          {...modalProps}
        >
          {!!image?.src && (
            <ReactCrop
              crop={crop}
              onChange={handleCropChange}
              onComplete={(_, relCrop) => setRelativeCrop(relCrop)}
              style={variantStyles.previewSize}
              {...targetCrop}
            >
              <img
                src={image?.src}
                css={[variantStyles.cropPreview, variantStyles.previewSize]}
              />
            </ReactCrop>
          )}
        </Modal>
      </>
    )
  },
)

export const CropPicker = React.memo(_CropPicker) as (props: CropPickerProps) => JSX.Element
