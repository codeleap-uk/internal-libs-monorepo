import { CreateOSAlert } from '@codeleap/common'
import { FileInputImageSource, useFileInput } from '../FileInput'
import { SortablePhotosProps } from './types'

const SortableAlert = CreateOSAlert()

export const useSortablePhotos = (props: SortablePhotosProps) => {
  const { photos, setPhotos, onPressItem } = props

  const input = useFileInput()

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

    setPhotos(newPhotos)
  }

  const handlePressItem = (currentData: any[], item: any, order: number) => {
    SortableAlert.ask({
      title: 'Open',
      body: 'body',
      options: [
        { text: 'library', onPress: () => handleOpenPicker('library', item, order) },
        { text: 'camera', onPress: () => handleOpenPicker('camera', item, order) }
      ]
    })

    onPressItem?.(currentData, item, order)
  }

  return {
    input,
    handlePressItem,
  }
}
