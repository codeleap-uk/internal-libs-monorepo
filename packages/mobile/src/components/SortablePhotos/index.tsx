import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { FileInput } from '../FileInput'
import { Icon } from '../Icon'
import { Image } from '../Image'
import { Dimensions, View } from 'react-native'
import { DragSortableView } from 'react-native-drag-sort'
import { SortableItemProps, SortablePhoto, SortablePhotosProps } from './types'
import { useSortablePhotos } from './useSortablePhotos'
import { useStylesFor } from '../../hooks'
import { MobileStyleRegistry } from '../../Registry'

export * from './styles'
export * from './types'

const DefaultItem = <T extends SortablePhoto>(props: SortableItemProps<T>) => {
  const { photo, width, height, styles, emptyIcon } = props

  return (
    <View style={[{ width, height }, styles.photoWrapper]}>
      {
        !!photo?.filename
          ? <Image resizeMode='cover' source={{ uri: photo?.filename }} style={styles.photoImage} />
          : <Icon name={emptyIcon} style={styles.photoEmptyIcon} />
      }
    </View>
  )
}

const screenWidth = Dimensions.get('screen').width

export const SortablePhotos = <T extends SortablePhoto>(props: SortablePhotosProps<T>) => {
  const {
    numColumns,
    renderPhoto: RenderItem,
    photos,
    gap,
    multiple,
    pickerConfig,
    emptyIcon,
    disableDragDropEmptyItems,
    itemWidth: _itemWidth,
    itemHeight: _itemHeight,
    width: _parentWidth,
    style,
    ...rest
  } = props

  const styles = useStylesFor(SortablePhotos.styleRegistryName, style)

  const {
    input,
    handlePressPhoto,
    numberPhotosMissing,
    emptyIndexes,
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
    <View style={styles.wrapper}>
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
        fixedItems={disableDragDropEmptyItems ? emptyIndexes : undefined}
        {...rest}
        renderItem={(item, order) => (
          <RenderItem
            width={itemWidth}
            height={itemHeight}
            photo={item}
            order={order}
            styles={styles}
            emptyIcon={emptyIcon}
          />
        )}
      />
    </View>
  )
}

SortablePhotos.styleRegistryName = 'SortablePhotos'
SortablePhotos.elements = ['wrapper', 'photo']
SortablePhotos.rootElement = 'wrapper'

SortablePhotos.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return SortablePhotos as <T extends SortablePhoto>(props: StyledComponentProps<SortablePhotosProps<T>, typeof styles>) => IJSX
}

SortablePhotos.defaultProps = {
  numColumns: 3,
  renderPhoto: DefaultItem,
  multiple: true,
  disableDragDropEmptyItems: true,
  gap: 16,
  emptyIcon: 'plus',
  pickerConfig: {
    cropping: true,
    showCropFrame: true,
    compressImageMaxHeight: 1700,
    compressImageMaxWidth: 1700,
    compressImageQuality: 0.8,
  },
} as Partial<SortablePhotosProps<any>>

MobileStyleRegistry.registerComponent(SortablePhotos)
