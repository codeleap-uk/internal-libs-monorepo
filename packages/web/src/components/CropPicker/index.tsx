import React, { forwardRef } from 'react'
import { GenericStyledComponentAttributes, useNestedStylesByKey } from '@codeleap/styles'
import { CropPickerProps } from './types'
import { Modal, Button, FileInput, LoadingOverlay, ColorPickerProps } from '../components'
import { useCropPicker } from '../../lib'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { ComponentWithDefaultProps } from '../../types'

const ReactCrop: React.ElementType = require('react-image-crop').Component
import 'react-image-crop/dist/ReactCrop.css'

const CropPickerCP = forwardRef((props: CropPickerProps, ref) => {

  const {
    onFileSelect,
    targetCrop,
    modalProps,
    title,
    confirmButton,
    debugName,
    handle,
    withLoading,
    style,
    ...fileInputProps
  } = {
    ...CropPickerCP.defaultProps,
    ...props,
  }

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
    // @ts-expect-error @verify
  } = handle || useCropPicker({ onFileSelect, ref, ...targetCrop })

  const styles = useStylesFor(CropPickerCP.styleRegistryName, style)

  const CropPickerCPStyles = useNestedStylesByKey('confirmCropPickerCP', styles)
  const modalStyles = useNestedStylesByKey('modal', styles)

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
            style={CropPickerCPStyles}
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
            style={styles.previewSize}
            {...targetCrop}
          >
            <img
              src={image?.src}
              // @ts-expect-error @verify
              css={[styles.cropPreview, styles.previewSize]}
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
}) as ComponentWithDefaultProps<CropPickerProps> & GenericStyledComponentAttributes<AnyRecord>

CropPickerCP.styleRegistryName = 'CropPicker'

CropPickerCP.elements = [
  'previewSize',
  'cropPreview',
  `confirmButton`,
  `modal`,
]

CropPickerCP.rootElement = 'previewSize'

CropPickerCP.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return CropPickerCP as (props: StyledComponentProps<CropPickerProps, typeof styles>) => IJSX
}

CropPickerCP.defaultProps = {
  title: 'Crop Image',
  confirmButton: 'Confirm Crop',
  withLoading: false,
} as Partial<CropPickerProps>

WebStyleRegistry.registerComponent(CropPickerCP)

export const CropPicker = React.memo(CropPickerCP) as ComponentWithDefaultProps<CropPickerProps> & GenericStyledComponentAttributes<AnyRecord>

export * from './styles'
export * from './types'
