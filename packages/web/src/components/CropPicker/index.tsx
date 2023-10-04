import React, { forwardRef } from 'react'
import { ReactCrop } from 'react-image-crop'
import { useDefaultComponentStyle } from '@codeleap/common'
import { CropPickerPresets } from './styles'
import { CropPickerProps } from './types'
import { useCropPicker } from './useCropPicker'
import { Modal, Button, FileInput, FileInputRef } from '../components'

import 'react-image-crop/dist/ReactCrop.css'

export * from './styles'
export * from './types'
export * from './utils'
export * from './useCropPicker'

export const _CropPicker = forwardRef<FileInputRef, CropPickerProps>(
  (
    {
      onFileSelect,
      targetCrop,
      variants = [],
      responsiveVariants = {},
      styles = {},
      modalProps = {},
      title = 'Crop Image',
      confirmButton = 'Confirm Crop',
      ...fileInputProps
    },
    ref,
  ) => {
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
    } = useCropPicker({ onFileSelect, ref, ...targetCrop })

    const variantStyles = useDefaultComponentStyle<
      'u:CropPicker',
      typeof CropPickerPresets
    >('u:CropPicker', {
      variants,
      responsiveVariants,
      styles,
    })

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
          variants={['centered']}
          style={variantStyles.wrapper}
          footer={
            <Button
              text={confirmButton}
              variants={['primary', 'fullWidth'] as any}
              onPress={onConfirmCrop}
              debugName={'confirm-crop'}
            />
          }
          {...modalProps}
        >
          {!!image?.src && (
            <ReactCrop
              crop={crop}
              onChange={handleCropChange}
              ruleOfThirds
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

export const CropPicker = React.memo(_CropPicker)
