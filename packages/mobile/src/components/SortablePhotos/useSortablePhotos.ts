import { CreateOSAlert, useMemo } from '@codeleap/common'
import { FileInputImageSource, useFileInput } from '../FileInput'
import { SortablePhotosProps } from './types'

const SortableAlert = CreateOSAlert()

export const useSortablePhotos = (props: SortablePhotosProps) => {
  const { photos, onChangePhotos, onPressItem } = props

  const input = useFileInput()

  const numberPhotosMissing = useMemo(() => {
    const copyPhotos = [...photos]

    const missingSlots = copyPhotos?.filter(photo => !!photo?.filename)

    return missingSlots?.length
  }, [JSON.stringify(photos)])

  const sortPhotos = (_unorderedPhotos: any[]) => {
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

  const handleOpenPicker = async (pickerType: FileInputImageSource, item: any, order: number) => {
    let files = []

    try {
      files = await input?.openFilePicker(pickerType)
    } catch (error) {
      console.error('Error opening file picker:', error)
    }

    const isMultiple = files?.length > 1

    console.log('files', files)

    const newPhotos = [...photos]

    if (isMultiple) {

    } else {
      const file = files[0]

      newPhotos[order] = {
        filename: file?.file?.uri
      }
    }

    const sortedPhotos = sortPhotos(newPhotos)

    onChangePhotos(sortedPhotos)
  }

  const handleDeletePhoto = (item: any, order: number) => {
    const newPhotos = [...photos]

    newPhotos[order] = {
      filename: null,
    }

    const sortedPhotos = sortPhotos(newPhotos)

    onChangePhotos(sortedPhotos)
  }

  const handlePressPhoto = (currentData: any[], item: any, order: number) => {
    SortableAlert.ask({
      title: 'Open',
      body: 'body',
      options: [
        { text: 'Library', onPress: () => handleOpenPicker('library', item, order) },
        { text: 'Camera', onPress: () => handleOpenPicker('camera', item, order) },
        { text: 'Delete', onPress: () => handleDeletePhoto(item, order) }
      ]
    })

    onPressItem?.(currentData, item, order)
  }

  const onChangePhotosOrder = (newData: any[]) => {
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
  }
}
