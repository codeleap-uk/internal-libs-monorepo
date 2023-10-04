import {
  WebInputFile,
  useBooleanToggle,
  useCallback,
  useImperativeHandle,
  usePromise,
  useRef,
  useState,
} from '@codeleap/common'
import { ImageReading, useCropPickerProps } from './types'
import { Crop } from 'react-image-crop'
import { cropImage, readImage } from './utils'
import { FileInputRef } from '../FileInput'

export function useCropPicker({ onFileSelect, ref, aspect, minWidth: minW, minHeight: minH }: useCropPickerProps) {
  const [visible, toggle] = useBooleanToggle(false)
  const [image, setImage] = useState<ImageReading>(null)
  const [crop, setCrop] = useState<Crop>()
  const [relativeCrop, setRelativeCrop] = useState<Crop>()
  const croppedPromise = usePromise<WebInputFile[]>({})

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

  const onFilesReturned = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event?.target?.files?.[0]
    const imageData = await readImage(file)
    const { naturalWidth, naturalHeight } = imageData
    const imageAspect = naturalWidth / naturalHeight
    const v = imageAspect >= aspect
      ? {
        width: ((naturalHeight * aspect) / naturalWidth) * 100,
        height: 100,
      }
      : {
        width: 100,
        height: (naturalWidth / aspect / naturalHeight) * 100,
      }
    const initialCrop = {
      ...v,
      x: (100 - v.width) / 2,
      y: (100 - v.height) / 2,
      unit: '%',
    }
    setCrop(initialCrop)
    setRelativeCrop(initialCrop)
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

  const minWidth = (minW ?? 100) * aspect
  const minHeight = minH ?? 100

  const handleCropChange = useCallback(
    (newCrop: Crop) => {
      setCrop({
        ...newCrop,
        width: newCrop.width < minWidth ? minWidth : newCrop.width,
        height: newCrop.height < minHeight ? minHeight : newCrop.height,
      })
    },
    [crop],
  )

  return {
    onCancel,
    onResolved,
    cleanup,
    onConfirmCrop,
    onFilesReturned,
    onClose,
    fileInputRef,
    visible,
    toggle,
    image,
    setImage,
    crop,
    setCrop,
    relativeCrop,
    setRelativeCrop,
    croppedPromise,
    handleCropChange,
  }
}
