import { TypeGuards, WebInputFile, useBooleanToggle, useDefaultComponentStyle, usePromise, useState } from '@codeleap/common'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { CropPickerPresets } from './styles'
import { CropPickerProps } from './types'
import { Crop, ReactCrop } from 'react-image-crop'
import { Modal, View, Button } from '../components'
import { FileInput, FileInputRef } from '../FileInput'

import 'react-image-crop/dist/ReactCrop.css'

export * from './styles'
export * from './types'

type ImageReading = HTMLImageElement

const readImage = (file: File | Blob): Promise<ImageReading> => {
  const reader = new FileReader()
  return new Promise<ImageReading>((resolve) => {
    reader.onload = () => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

function cropImage(image: ImageReading, crop: Crop): Promise<[string, Blob]> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { alpha: true })

  if (!ctx) throw new Error('No 2d context')

  canvas.width = image.naturalWidth * (crop.width / 100)
  canvas.height = image.naturalHeight * (crop.height / 100)

  const x = image.naturalWidth * (crop.x / 100)
  const y = image.naturalHeight * (crop.y / 100)

  ctx.drawImage(
    image,
    x,
    y,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  return new Promise<[string, Blob]>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('Canvas is empty'))
        return
      }
      readImage(blob).then(cropped => {
        resolve([cropped.src, blob])
      }).catch(reject)
    }, 'image/png')
  })
}

export const _CropPicker = forwardRef<FileInputRef, CropPickerProps>((props, ref) => {
  const {
    onFileSelect,
    targetCrop,
    variants = [],
    responsiveVariants = {},
    styles = {},
    ...fileInputProps
  } = props
  const [visible, toggle] = useBooleanToggle(false)
  const [image, setImage] = useState<ImageReading>(null)
  const [crop, setCrop] = useState<Crop | undefined>()
  const [relativeCrop, setRelativeCrop] = useState<Crop>(null)
  const croppedPromise = usePromise<WebInputFile[]>({})

  const variantStyles = useDefaultComponentStyle<
    'u:CropPicker',
    typeof CropPickerPresets
  >('u:CropPicker', {
    variants,
    responsiveVariants,
    styles,
  })

  const onCancel = () => croppedPromise.resolve([])

  const onResolved = (files: WebInputFile[]) => {
    croppedPromise.resolve?.(files)
    onFileSelect?.(files)
  }

  const cleanup = () => {
    setImage(null)
    setRelativeCrop(null)
    setCrop(undefined)
  }

  const onConfirmCrop = async () => {
    const [preview, croppedFile] = await cropImage(image, relativeCrop)
    onResolved([
      {
        file: new File([croppedFile], 'cropped.jpg'),
        preview,
      },
    ])
    toggle()
    setTimeout(() => cleanup())
  }

  const onFilesReturned = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    const imageData = await readImage(file)
    setImage(imageData)
    setTimeout(() => toggle())
  }

  const onClose = () => {
    toggle()
    onCancel()
    setTimeout(() => cleanup())
  }

  const fileInputRef = useRef<FileInputRef>(null)

  useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      fileInputRef.current.openFilePicker()
      return croppedPromise._await()
    },
    clear: () => {
      fileInputRef.current.clear()
      return croppedPromise._await()
    },
  }))

  const isConfirmEnabled = TypeGuards.isNumber(crop?.width) && TypeGuards.isNumber(relativeCrop?.width) && !!image?.src

  return <>
    <FileInput
      {...fileInputProps}
      ref={fileInputRef}
      onChange={files => onFilesReturned(files)}
    />
    <Modal
      visible={visible}
      toggle={onClose}
      title={'Crop Image'}
      variants={['centered']}
      style={variantStyles.wrapper}
    >
      <View variants={['column', 'gap:2']} >
        {
          !!image?.src && (
            <ReactCrop
              {...targetCrop}
              crop={crop}
              onChange={setCrop}
              ruleOfThirds
              onComplete={(_, relCrop) => setRelativeCrop(relCrop)}
              style={variantStyles.previewSize}
            >
              <img src={image?.src} css={[variantStyles.cropPreview, variantStyles.previewSize]} />
            </ReactCrop>
          )
        }
        <Button
          text={'Confirm'}
          onPress={onConfirmCrop}
          disabled={!isConfirmEnabled}
          debugName={'confirm-crop'}
        />
      </View>
    </Modal>
  </>
})

export const CropPicker = React.memo(_CropPicker)
