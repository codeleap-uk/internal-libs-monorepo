import { CreateOSAlert } from '@codeleap/common'
import { AppIcon } from '@codeleap/styles'
import { ReactElement, useRef } from 'react'
import { FileInput, FileInputImageSource, useFileInput } from '../FileInput'
import { Icon } from '../Icon'
import { Image } from '../Image'
import { Dimensions, View } from 'react-native'
import { DragSortableView } from 'react-native-drag-sort'
import { SortableItemProps, SortablePhotosProps } from './types'

export * from './types'

const SortableAlert = CreateOSAlert()

const DefaultItem = (props: SortableItemProps) => {
  const { item, order, width, height } = props

  // if (!!item?.filename) {
  //   return (
  //     <View style={{ width, height }}>
  //       <Image resizeMode='cover' source={{ uri: item?.filename }} />
  //     </View>
  //   )
  // }

  return (
    <View style={{ width, height, backgroundColor: '#0002' }}>
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
    onPressItem,
    gap,
    itemWidth,
    itemHeight = itemWidth,
    width: sortableWidth,
    setPhotos,
    multiple,
    maxFiles,
    pickerConfig,
    ...rest
  } = props

  const photoWidth = (sortableWidth - (gap * (numColumns * 2))) / numColumns

  console.log(photoWidth)
  console.log(itemWidth)

  const pressedPhotoRef = useRef(null)

  const input = useFileInput()

  const fileInputPickerOptions = {
    ...SortablePhotos.defaultProps.pickerConfig,
    ...pickerConfig,
    multiple,
    maxFiles,
  }

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
    <View style={{ width: '100%', height: '100%', backgroundColor: '#0002', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <FileInput 
        mode='hidden'
        ref={input.ref}
        pickerOptions={fileInputPickerOptions}
      />

      <DragSortableView
        dataSource={photos}
        renderItem={(item, order) => <RenderItem key={item.key} width={photoWidth} height={photoWidth} item={item} order={order} />}
        onClickItem={handlePressItem}
        childrenHeight={photoWidth}
        childrenWidth={photoWidth}
        parentWidth={sortableWidth}
        marginChildrenBottom={gap}
        marginChildrenLeft={gap}
        marginChildrenRight={gap}
        marginChildrenTop={gap}
        {...rest}
      />
    </View>
  )
}

// numColumns
// gap

SortablePhotos.defaultProps = {
  numColumns: 3,
  renderItem: DefaultItem,
  multiple: false,
  maxFiles: 1,
  gap: 8,
  width: Dimensions.get('window').width - 16,
  pickerConfig: {
    cropping: true,
    showCropFrame: true,
    compressImageMaxHeight: 1700,
    compressImageMaxWidth: 1700,
    compressImageQuality: 0.8,
  },
} as Partial<SortablePhotosProps>
