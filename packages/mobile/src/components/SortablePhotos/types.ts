import { ReactElement } from 'react'

export type SortablePhoto = {
  filename: string | null
}

export type SortableItemProps<T extends SortablePhoto> = {
  item: T
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

export type SortablePhotosProps<T extends SortablePhoto> = {
  numColumns?: number
  renderItem: (props: SortableItemProps<T>) => ReactElement
  photos: T[]
  onChangePhotos: (newPhotos: T[]) => void
  gap?: number
  itemHeight?: number
  itemWidth: number
  width?: number
  onPressItem?: (data: T[], item: T, order: number) => void
  onDragStart?: (fromIndex: number) => void
  onDragEnd?: (fromIndex: number, toIndex: number) => void
  keyExtractor?: (item: T, order: number) => any
  delayLongPress?: number
  pickerConfig?: SortablePhotosPickerConfig
  multiple?: boolean
  maxScale?: number
  minOpacity?: number
  scaleDuration?: number
  slideDuration?: number
}
