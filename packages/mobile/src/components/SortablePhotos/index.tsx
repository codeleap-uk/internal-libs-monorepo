import { AnyRecord, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'
import { FileInput } from '../FileInput'
import { Icon } from '../Icon'
import { Image } from '../Image'
import { Dimensions, View } from 'react-native'
import { DragSortableView } from 'react-native-drag-sort'
import { SortableItemProps, SortablePhoto, SortablePhotosProps } from './types'
import { useSortablePhotos } from './useSortablePhotos'
import { useStylesFor } from '../../hooks'
import { MobileStyleRegistry } from '../../Registry'
import { ActivityIndicator } from '../ActivityIndicator'

export * from './styles'
export * from './types'

const DefaultItem = <T extends SortablePhoto>(props: SortableItemProps<T>) => {
  const { photo, width, height, styles, emptyIcon } = props

  return (
    <View style={[{ width, height }, styles.photoWrapper]}>
      {
        !!photo?.filename
          ? <Image resizeMode='cover' source={{ uri: photo?.file }} style={styles.photoImage} />
          : <Icon name={emptyIcon} style={styles.photoEmptyIcon} />
      }
    </View>
  )
}

const defaultGetFilename = (file: string) => {
  if (!file) return null

  const filenameWithExtension = file?.split?.('/').pop()

  if (filenameWithExtension) {
    return filenameWithExtension?.split('.').slice(0, -1).join('.')
  }

  return new Date().toISOString()
}

const screenWidth = Dimensions.get('screen').width

export const SortablePhotos = <T extends SortablePhoto>(props: SortablePhotosProps<T>) => {
  const allProps = {
    ...SortablePhotos.defaultProps,
    ...props,
  }

  const {
    numColumns,
    renderPhoto: RenderItem,
    gap,
    multiple,
    pickerConfig,
    emptyIcon,
    disableDragDropEmptyItems,
    itemWidth: _itemWidth,
    itemHeight: _itemHeight,
    width: _parentWidth,
    style,
    loading,
    ...rest
  } = allProps

  const styles = useStylesFor(SortablePhotos.styleRegistryName, style)

  const loaderStyles = useNestedStylesByKey('loader', styles)

  const {
    input,
    handlePressPhoto,
    numberPhotosMissing,
    emptyIndexes,
    onChangePhotosOrder,
    data,
  } = useSortablePhotos<T>(allProps)

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

  if (loading) {
    return (
      <View style={[styles.wrapper, styles['wrapper:loading']]}>
        <ActivityIndicator style={loaderStyles} />
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <FileInput
        mode='hidden'
        ref={input.ref}
        pickerOptions={fileInputPickerOptions}
      />

      <DragSortableView
        dataSource={data}
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
SortablePhotos.elements = ['wrapper', 'photo', 'loader']
SortablePhotos.rootElement = 'wrapper'

SortablePhotos.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return SortablePhotos as <T extends SortablePhoto>(props: StyledComponentProps<SortablePhotosProps<T>, typeof styles>) => IJSX
}

SortablePhotos.defaultProps = {
  numPhotos: 9,
  numColumns: 3,
  renderPhoto: DefaultItem,
  multiple: true,
  disableDragDropEmptyItems: true,
  gap: 16,
  emptyIcon: 'plus',
  modalTitle: 'Photos',
  modalBody: null,
  modalLibraryText: 'Choose from gallery',
  modalCameraText: 'Take a photo',
  modalDeleteText: 'Remove photo',
  getFilename: defaultGetFilename,
  pickerConfig: {
    cropping: true,
    showCropFrame: true,
    compressImageMaxHeight: 1700,
    compressImageMaxWidth: 1700,
    compressImageQuality: 0.8,
  },
} as Partial<SortablePhotosProps<any>>

MobileStyleRegistry.registerComponent(SortablePhotos)
