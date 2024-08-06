import {
  WebInputFile,
  useBooleanToggle,
  useCallback,
  useImperativeHandle,
  usePromise,
  useRef,
  useState,
} from '@codeleap/common'
import { ImageReading } from '../../components/CropPicker'
import { FileInputProps, FileInputRef } from '../../components/FileInput'
import { Crop, ReactCropProps } from 'react-image-crop'

export type UseCropPickerProps = Partial<ReactCropProps> & {
  onFileSelect: FileInputProps['onFileSelect']
  ref: React.MutableRefObject<FileInputRef> | React.Ref<FileInputRef>
}

type ImageType = 'png' | 'jpeg' | 'webp'

export function readImage(file: File | Blob): Promise<ImageReading> {
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

export function cropImage(image: ImageReading, crop: Crop, type: ImageType): Promise<[string, Blob]> {
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
    }, `image/${type}`)
  })
}

export function useCropPicker({
  onFileSelect,
  ref,
  aspect,
  minWidth: minW,
  minHeight: minH,
}: UseCropPickerProps) {
  const [visible, toggle] = useBooleanToggle(false)
  const [image, setImage] = useState<ImageReading>(null)
  const [crop, setCrop] = useState<Crop>()
  const [relativeCrop, setRelativeCrop] = useState<Crop>()
  const [isLoading, setIsLoading] = useState(false)
  const croppedPromise = usePromise<WebInputFile[]>({})

  const onCancel = () => croppedPromise.resolve([])

  const onResolved = (files: WebInputFile[]) => {
    croppedPromise.resolve?.(files)
    onFileSelect?.(files)
  }

  const cleanup = () => {
    toggle()
    setRelativeCrop(null)
    setCrop(undefined)
    setTimeout(() => setImage(null), 500)
  }

  const onConfirmCrop = async (imageType: ImageType = 'jpeg') => {
    setIsLoading(true)
    const [preview, croppedFile] = await cropImage(image, relativeCrop, imageType)
    onResolved([
      {
        file: new File([croppedFile], 'cropped.jpg'),
        preview,
      },
    ])
    setIsLoading(false)
    setTimeout(() => cleanup())
  }

  const onFilesReturned = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event?.target?.files?.[0]
    const imageData = await readImage(file)
    const { naturalWidth, naturalHeight } = imageData
    const imageAspect = naturalWidth / naturalHeight
    const v =
        imageAspect >= aspect
          ? {
            width: ((naturalHeight * aspect) / naturalWidth) * 100,
            height: 100,
          }
          : {
            width: 100,
            height: (naturalWidth / aspect / naturalHeight) * 100,
          }
    const initialCrop: Crop = {
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
    isLoading,
    croppedPromise,
    handleCropChange,
  }
}
