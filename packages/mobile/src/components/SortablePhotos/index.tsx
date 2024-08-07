import { CreateOSAlert } from '@codeleap/common'
import { AppIcon } from '@codeleap/styles'
import { ReactElement, useRef } from 'react'
import { FileInput, FileInputImageSource, useFileInput } from '../FileInput'
import { Icon } from '../Icon'
import { Image } from '../Image'

import { View } from 'react-native'
import DraggableGrid from 'react-native-draggable-grid'

type Photo = {
  filename: any
}

type ItemProps = {
  item: Photo
  order: number
  height: number
  width: number
}

type SortablePhotosProps = {
  numColumns?: number
  renderItem: (props: ItemProps) => ReactElement
  photos: Photo[]
  setPhotos: any
  onDragStart?: () => void
  onDragEnd?: () => void
  onItemPress?: () => void
  itemHeight: number
  itemWidth: number
}

const pickerOptions = {
  multiple: true,
  maxFiles: 1,
  cropping: true,
  showCropFrame: true,
  compressImageMaxHeight: 1700,
  compressImageMaxWidth: 1700,
  compressImageQuality: 0.8,
}

const SortableAlert = CreateOSAlert()

const DefaultItem = ({ item, order, width, height }: ItemProps) => {
  // if (!!item?.filename) {
  //   return (
  //     <View style={{ width, height }}>
  //       <Image resizeMode='cover' source={{ uri: item?.filename }} />
  //     </View>
  //   )
  // }

  return (
    <View key={item.key} style={{ width, height, backgroundColor: '#0002' }}>
      {/* <Icon name={'user' as AppIcon} color='red' /> */}
    </View>
  )
}

export const SortablePhotos = (props: SortablePhotosProps) => {
  const {
    numColumns,
    renderItem: RenderItem,
    photos,
    onDragEnd,
    onDragStart,
    onItemPress,
    itemHeight,
    itemWidth,
    setPhotos,
  } = props

  const pressedPhotoRef = useRef(null)

  const input = useFileInput()

  const handleOpenPicker = async (pickerType: FileInputImageSource) => {
    let files = []

    try {
      files = await input?.openFilePicker(pickerType)
    } catch (error) {
      console.error('Error opening file picker:', error)
    }

    pressedPhotoRef.current = null
  }

  const handlePressItem = (item) => {
    SortableAlert.ask({
      title: 'Open',
      body: 'body',
      options: [
        { text: 'library', onPress: () => handleOpenPicker('library') },
        { text: 'camera', onPress: () => handleOpenPicker('camera') }
      ]
    })

    console.log('PRESSED')

    pressedPhotoRef.current = item
  }

  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
      <FileInput 
        mode='hidden'
        ref={input.ref}
        pickerOptions={pickerOptions}
      />

      <DraggableGrid<Photo>
        numColumns={numColumns}
        data={photos}
        renderItem={(item, order) => <RenderItem key={item.key} width={itemWidth} height={itemHeight} item={item} order={order} />}
        onDragRelease={(items) => setPhotos(items)}
        onItemPress={handlePressItem}
      />
    </View>
  )
}

SortablePhotos.defaultProps = {
  numColumns: 3,
  renderItem: DefaultItem,
} as Partial<SortablePhotosProps>
