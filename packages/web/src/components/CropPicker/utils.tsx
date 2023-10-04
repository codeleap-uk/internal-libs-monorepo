import { Crop } from 'react-image-crop'
import { ImageReading } from './types'

export const readImage = (file: File | Blob): Promise<ImageReading> => {
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

export function cropImage(image: ImageReading, crop: Crop): Promise<[string, Blob]> {
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
