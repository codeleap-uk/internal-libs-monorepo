import { CreateOSAlert } from '@codeleap/modals'
import { useEffect, useMemo, useState } from '@codeleap/hooks'
import { FileInputImageSource, useFileInput } from '../FileInput'
import { SortablePhoto, SortablePhotosProps } from './types'

const SortableAlert = CreateOSAlert()

export const useSortablePhotos = <T extends SortablePhoto>(props: SortablePhotosProps<T>) => {
  const {
    onChangePhotos,
    onPressPhoto,
    modalBody,
    modalTitle,
    modalCameraText,
    modalDeleteText,
    modalLibraryText,
    getFilename,
    numPhotos,
    loading,
    photos: currentPhotos
  } = props

  const input = useFileInput()

  const [data, setData] = useState<T[]>([])

  const onChange = (photos: T[]) => {
    const { newPhotos, sortedPhotos } = sortPhotos(photos)

    setData(sortedPhotos)
    onChangePhotos(newPhotos)
  }

  useEffect(() => {
    if (!loading && data?.length < numPhotos) {
      const currentLength = currentPhotos?.length ?? 0
      const length = Math.abs(numPhotos - currentLength)
      const fillPhotos = Array(length).fill({ filename: null, file: null }) as T[]

      const newPhotos = currentPhotos.concat(fillPhotos)

      setData(newPhotos)
      onChangePhotos(currentPhotos)
    }
  }, [loading])

  const { emptyIndexes, numberPhotosMissing } = useMemo(() => {
    const copyPhotos = [...data]

    const emptyIndexes = copyPhotos.reduce((indexes, photo, index) => {
      if (!photo?.filename) {
        indexes.push(index)
      }
      return indexes
    }, [])

    const numberPhotosMissing = emptyIndexes?.length

    return {
      emptyIndexes,
      numberPhotosMissing,
    }
  }, [JSON.stringify(data)])

  const sortPhotos = (_unorderedPhotos: T[]) => {
    const unorderedPhotos = [..._unorderedPhotos]

    const [newPhotos, emptyPhotos] = unorderedPhotos.reduce(
      ([newPhotos, emptyPhotos], photo) => {
        !!photo?.filename ? newPhotos.push(photo) : emptyPhotos.push(photo)
        return [newPhotos, emptyPhotos]
      },
      [[], []] as [T[], T[]]
    )

    const sortedPhotos: T[] = newPhotos.concat(emptyPhotos)

    return {
      sortedPhotos,
      newPhotos,
    }
  }

  const handleOpenPicker = async (pickerType: FileInputImageSource, photo: T, order: number) => {
    let files = []

    const isEdit = !!photo?.filename

    try {
      files = await input?.openFilePicker(pickerType, {
        multiple: isEdit ? false : props?.multiple
      })
    } catch (error) {
      console.error('Error opening file picker:', error)
    }

    if (files?.length <= 0) return null

    const isMultiple = files?.length > 1 && !isEdit

    const newPhotos = [...data]

    if (isMultiple) {
      for (const fileIndex in files) {
        const file = files?.[fileIndex]
        const order = emptyIndexes[fileIndex]
        const uri = file?.file?.uri
        const filename = getFilename(uri)

        newPhotos[order] = {
          ...newPhotos[order],
          filename,
          file: uri,
        } as T
      }
    } else {
      const file = files?.[0]
      const uri = file?.file?.uri
      const filename = getFilename(uri)

      newPhotos[order] = {
        ...newPhotos[order],
        filename,
        file: uri,
      } as T
    }

    onChange(newPhotos)
  }

  const handleDeletePhoto = (photo: T, order: number) => {
    const newPhotos = [...data]

    newPhotos[order] = {
      ...newPhotos[order],
      filename: null,
      file: null,
    } as T

    onChange(newPhotos)
  }

  const handlePressPhoto = (currentData: T[], photo: T, order: number) => {
    SortableAlert.custom({
      title: modalTitle,
      body: modalBody,
      options: [
        { text: modalLibraryText, onPress: () => handleOpenPicker('library', photo, order) },
        { text: modalCameraText, onPress: () => handleOpenPicker('camera', photo, order) },
        !!photo?.filename && { text: modalDeleteText, onPress: () => handleDeletePhoto(photo, order) },
      ],
      // @ts-expect-error
      isRow: false,
    })

    onPressPhoto?.(currentData, photo, order)
  }

  const onChangePhotosOrder = (newData: T[]) => {
    onChange(newData)
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
    data,
  }
}
