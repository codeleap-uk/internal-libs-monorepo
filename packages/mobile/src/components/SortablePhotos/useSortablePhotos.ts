import { CreateOSAlert, useGlobalContext, useMemo } from '@codeleap/common'
import { FileInputImageSource, useFileInput } from '../FileInput'
import { SortablePhoto, SortablePhotosProps } from './types'

const SortableAlert = CreateOSAlert()

export const useSortablePhotos = <T extends SortablePhoto>(props: SortablePhotosProps<T>) => {
  const { photos, onChangePhotos, onPressPhoto } = props

  const input = useFileInput()
  const { logger } = useGlobalContext()

  const { emptyIndexes, numberPhotosMissing } = useMemo(() => {
    const copyPhotos = [...photos]

    const emptyIndexes = copyPhotos.map((photo, index) => !!photo?.filename ? null : index).filter(v => typeof v === 'number')

    const numberPhotosMissing = emptyIndexes?.length

    return {
      emptyIndexes,
      numberPhotosMissing,
    }
  }, [JSON.stringify(photos)])

  const sortPhotos = (_unorderedPhotos: T[]): T[] => {
    const unorderedPhotos = [..._unorderedPhotos]
    const newPhotos = []
    const missingPhotos = []

    for (const unorderedPhoto of unorderedPhotos) {
      if (!!unorderedPhoto?.filename) {
        newPhotos.push(unorderedPhoto)
      } else {
        missingPhotos.push(unorderedPhoto)
      }
    }

    return [...newPhotos, ...missingPhotos]
  }

  const handleOpenPicker = async (pickerType: FileInputImageSource, photo: T, order: number) => {
    let files = []

    const isEdit = !!photo?.filename

    try {
      files = await input?.openFilePicker(pickerType, {
        multiple: isEdit ? false : props?.multiple
      })
    } catch (error) {
      logger.error('Error opening file picker:', error)
    }

    const isMultiple = files?.length > 1 && !isEdit

    const newPhotos = [...photos]

    if (isMultiple) {
      for (const idx in files) {
        const file = files?.[idx]

        newPhotos[emptyIndexes[idx]] = {
          filename: file?.file?.uri
        } as T
      }
    } else {
      const file = files?.[0]

      newPhotos[order] = {
        filename: file?.file?.uri
      } as T
    }

    const sortedPhotos = sortPhotos(newPhotos)

    onChangePhotos(sortedPhotos)
  }

  const handleDeletePhoto = (photo: T, order: number) => {
    const newPhotos = [...photos]

    newPhotos[order] = {
      filename: null,
    } as T

    const sortedPhotos = sortPhotos(newPhotos)

    onChangePhotos(sortedPhotos)
  }

  const handlePressPhoto = (currentData: T[], photo: T, order: number) => {
    SortableAlert.ask({
      title: 'Open',
      body: 'body',
      options: [
        { text: 'Library', onPress: () => handleOpenPicker('library', photo, order) },
        { text: 'Camera', onPress: () => handleOpenPicker('camera', photo, order) },
        !!photo?.filename && { text: 'Delete', onPress: () => handleDeletePhoto(photo, order) }
      ]
    })

    onPressPhoto?.(currentData, photo, order)
  }

  const onChangePhotosOrder = (newData: T[]) => {
    const sortedPhotos = sortPhotos(newData)

    onChangePhotos(sortedPhotos)
  }

  return {
    input,
    handlePressPhoto,
    handleDeletePhoto,
    handleOpenPicker,
    sortPhotos,
    numberPhotosMissing,
    onChangePhotosOrder,
    emptyIndexes,
  }
}
