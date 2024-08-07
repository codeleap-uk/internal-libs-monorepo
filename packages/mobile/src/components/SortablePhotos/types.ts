import { ReactElement } from 'react'

type Photo = {
  filename: any
}

export type SortableItemProps = {
  item: Photo
  order: number
  height: number
  width: number
}

export type SortablePhotosPickerConfig = {
  cropping?: boolean
  compressImageMaxHeight?: number
  compressImageMaxWidth?: number
  compressImageQuality?: number
  showCropFrame?: boolean
}

export type SortablePhotosProps = {
  numColumns?: number
  renderItem: (props: SortableItemProps) => ReactElement
  photos: Photo[]
  onChangePhotos: (newPhotos: any[]) => void
  gap?: number
  itemHeight?: number
  itemWidth: number
  width?: number
  onPressItem?: (data: any[], item: any, order: number) => void
  onDragStart?: (fromIndex: number) => void
  onDragEnd?: (fromIndex: number, toIndex: number) => void
  keyExtractor?: (item: any, order: number) => any
  delayLongPress?: number
  pickerConfig?: SortablePhotosPickerConfig
  multiple?: boolean
  maxScale?: number
  minOpacity?: number
  scaleDuration?: number
  slideDuration?: number
}
