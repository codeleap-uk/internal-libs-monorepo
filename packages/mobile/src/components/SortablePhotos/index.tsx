import { AppIcon } from '@codeleap/styles'
import { FileInput } from '../FileInput'
import { Icon } from '../Icon'
import { Image } from '../Image'
import { Dimensions, View } from 'react-native'
import { DragSortableView } from 'react-native-drag-sort'
import { SortableItemProps, SortablePhoto, SortablePhotosProps } from './types'
import { useSortablePhotos } from './useSortablePhotos'

export * from './types'

const DefaultItem = <T extends SortablePhoto>(props: SortableItemProps<T>) => {
  const { item, width, height } = props

  return (
    <View style={{ width, height, backgroundColor: '#0002', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {
        !!item?.filename
          ? <Image resizeMode='cover' source={{ uri: item?.filename }} style={{ width: '100%', height: '100%' }} />
          : <Icon name={'plus' as AppIcon} style={{ color: '#0003' }} size={32} />
      }
    </View>
  )
}

const screenWidth = Dimensions.get('screen').width

export const SortablePhotos = <T extends SortablePhoto>(props: SortablePhotosProps<T>) => {
  const {
    numColumns,
    renderItem: RenderItem,
    photos,
    gap,
    multiple,
    pickerConfig,
    itemWidth: _itemWidth,
    itemHeight: _itemHeight,
    width: _parentWidth,
    ...rest
  } = props

  const {
    input,
    handlePressPhoto,
    numberPhotosMissing,
    onChangePhotosOrder,
  } = useSortablePhotos<T>(props)

  const defaultParentWidth = screenWidth - (gap * 2)
  const defaultItemWidth = (defaultParentWidth / numColumns) - gap

  const itemWidth = _itemWidth ?? defaultItemWidth
  const itemHeight = _itemHeight ?? itemWidth
  const parentWidth = _parentWidth ?? defaultParentWidth

  const childrenMargin = gap / 2

  const fileInputPickerOptions = {
    ...SortablePhotos.defaultProps.pickerConfig,
    ...pickerConfig,
    multiple,
    maxFiles: numberPhotosMissing,
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
        childrenHeight={itemHeight}
        childrenWidth={itemWidth}
        parentWidth={parentWidth}
        marginChildrenBottom={childrenMargin}
        marginChildrenLeft={childrenMargin}
        marginChildrenRight={childrenMargin}
        marginChildrenTop={childrenMargin}
        onDataChange={onChangePhotosOrder}
        onClickItem={handlePressPhoto}
        {...rest}
        renderItem={(item, order) => (
          <RenderItem
            width={itemWidth}
            height={itemHeight}
            item={item}
            order={order}
          />
        )}
      />
    </View>
  )
}

SortablePhotos.defaultProps = {
  numColumns: 3,
  renderItem: DefaultItem,
  multiple: true,
  gap: 16,
  pickerConfig: {
    cropping: true,
    showCropFrame: true,
    compressImageMaxHeight: 1700,
    compressImageMaxWidth: 1700,
    compressImageQuality: 0.8,
  },
} as Partial<SortablePhotosProps<any>>
