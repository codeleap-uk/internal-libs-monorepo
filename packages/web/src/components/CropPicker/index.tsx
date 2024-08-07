import React, { forwardRef, Ref } from 'react'
import { StyledComponentWithProps, useCompositionStyles } from '@codeleap/styles'
import { CropPickerProps } from './types'
import { useCropPicker } from '../../lib'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { FileInput, FileInputRef } from '../FileInput'
import { Modal } from '../Modal'
import { Button } from '../Button'
import { LoadingOverlay } from '../LoadingOverlay'

const ReactCrop: React.ElementType = require('react-image-crop').Component

import 'react-image-crop/dist/ReactCrop.css'

export * from './styles'
export * from './types'

export const CropPicker = forwardRef<FileInputRef, CropPickerProps>((props, ref) => {
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
    confirmButtonProps,
    ...fileInputProps
  } = {
    ...CropPicker.defaultProps,
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
  } = handle || useCropPicker({ onFileSelect, ref: ref as unknown as Ref<FileInputRef>, ...targetCrop })

  const styles = useStylesFor(CropPicker.styleRegistryName, style)

  const composition = useCompositionStyles(['confirmButton', 'modal'], styles)

  return (
    <>
      <FileInput
        // @ts-ignore
        ref={fileInputRef}
        onChange={(files) => onFilesReturned(files)}
        {...fileInputProps}
      />

      <Modal
        visible={visible}
        toggle={onClose}
        title={title}
        footer={
          <Button
            text={confirmButton}
            style={composition?.confirmButton}
            onPress={onConfirmCrop}
            debugName={debugName}
            {...confirmButtonProps}
          />
        }
        {...modalProps}
        style={composition?.modal}
      >
        {!!image?.src ? (
          <ReactCrop
            crop={crop}
            onChange={handleCropChange}
            onComplete={(_, relCrop) => setRelativeCrop(relCrop)}
            {...targetCrop}
            style={styles.previewSize}
          >
            <img
              src={image?.src}
              // @ts-expect-error
              css={[styles.cropPreview, styles.previewSize]}
            />
          </ReactCrop>
        ) : null}
        {withLoading ? <LoadingOverlay debugName='CropPicker' visible={isLoading} /> : null}
      </Modal>
    </>
  )
}) as StyledComponentWithProps<CropPickerProps>

CropPicker.styleRegistryName = 'CropPicker'
CropPicker.elements = ['previewSize', 'cropPreview', 'confirmButton', 'modal']
CropPicker.rootElement = 'previewSize'

CropPicker.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return CropPicker as (props: StyledComponentProps<CropPickerProps, typeof styles>) => IJSX
}

CropPicker.defaultProps = {
  title: 'Crop Image',
  confirmButton: 'Confirm Crop',
  withLoading: false,
} as Partial<CropPickerProps>

WebStyleRegistry.registerComponent(CropPicker)
