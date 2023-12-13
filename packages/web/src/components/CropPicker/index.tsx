import React, { forwardRef } from 'react'
import {
  getNestedStylesByKey,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { CropPickerPresets } from './styles'
import { CropPickerProps } from './types'
import { useCropPicker } from './useCropPicker'
import { Modal, Button, FileInput, FileInputRef, LoadingOverlay } from '../components'

const ReactCrop: React.Component = require('react-image-crop').Component
import 'react-image-crop/dist/ReactCrop.css'
import { ComponentWithDefaultProps } from '../../types'

export * from './styles'
export * from './types'
export * from './utils'
export * from './useCropPicker'

export const _CropPicker = forwardRef<FileInputRef, CropPickerProps>(
  (props: CropPickerProps, ref) => {
    const allProps = {
      ...CropPicker.defaultProps,
      ...props,
    }

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
      withLoading = false,
      ...fileInputProps
    } = allProps

    const {
      onConfirmCrop,
      onFilesReturned,
      onClose,
      fileInputRef,
      visible,
      image,
      crop,
      setRelativeCrop,
      isLoading,
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
          {
            withLoading ? (
              <LoadingOverlay
                debugName='CropPicker'
                visible={isLoading}
              />
            ) : null
          }
        </Modal>
      </>
    )
  },
)

export const CropPicker = React.memo(_CropPicker) as ComponentWithDefaultProps<CropPickerProps>
