import { AnyRecord, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'
import { FileInput } from '../FileInput'
import { Icon } from '../Icon'
import { Image } from '../Image'
import { Pressable, View } from 'react-native'
import { SortableItemProps, SortablePhoto, SortablePhotosProps, WithId } from './types'
import { useSortablePhotos } from './useSortablePhotos'
import { useStylesFor } from '../../hooks'
import { MobileStyleRegistry } from '../../Registry'
import { ActivityIndicator } from '../ActivityIndicator'
import Sortable, { type SortableGridRenderItem } from 'react-native-sortables'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useCallback } from 'react'

export * from './styles'
export * from './types'

const DefaultItem = <T extends SortablePhoto>(props: SortableItemProps<T>) => {
  const { photo, styles, emptyIcon } = props

  return (
    <View style={styles.photoWrapper}>
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
    enabledDragDrop,
    onChangePhotosOrder,
    data,
  } = useSortablePhotos<T>(allProps)

  const fileInputPickerOptions = {
    ...SortablePhotos.defaultProps.pickerConfig,
    ...pickerConfig,
    multiple,
    maxFiles: numberPhotosMissing,
  }

  const renderItem: SortableGridRenderItem<WithId<T>> = useCallback(({ item, index }) => (
    <Sortable.Pressable onPress={() => handlePressPhoto(item, index)}>
      <RenderItem
        photo={item}
        order={index}
        styles={styles}
        emptyIcon={emptyIcon}
      />
    </Sortable.Pressable>
  ), [handlePressPhoto])

  if (loading) {
    return (
      <View style={[styles.wrapper, styles['wrapper:loading']]}>
        <ActivityIndicator style={loaderStyles} />
      </View>
    )
  }

  return <GestureHandlerRootView>
    <View style={styles.wrapper}>
      <FileInput
        mode='hidden'
        ref={input.ref}
        pickerOptions={fileInputPickerOptions}
      />

      <Sortable.Grid
        columns={numColumns}
        columnGap={gap}
        rowGap={gap}
        sortEnabled={enabledDragDrop}
        showDropIndicator
        {...rest}
        data={data}
        renderItem={renderItem}
        onDragEnd={({ data }) => onChangePhotosOrder(data as unknown as WithId<T>[])}
      />
    </View>
  </GestureHandlerRootView>
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
  gap: 8,
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
