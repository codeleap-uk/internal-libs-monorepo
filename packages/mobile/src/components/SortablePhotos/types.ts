import { AppIcon, ICSS, StyledProp } from '@codeleap/styles'
import { ReactElement } from 'react'
import { SortablePhotosComposition } from './styles'

export type SortablePhoto = {
  filename: string | null
}

export type SortableItemProps<T extends SortablePhoto> = {
  photo: T
  order: number
  height: number
  width: number
  styles: Record<SortablePhotosComposition, ICSS>
  emptyIcon: AppIcon
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
  renderPhoto?: (props: SortableItemProps<T>) => ReactElement
  photos: T[]
  onChangePhotos: (newPhotos: T[]) => void
  gap?: number
  itemHeight?: number
  itemWidth?: number
  width?: number
  onPressPhoto?: (data: T[], photo: T, order: number) => void
  onDragStart?: (fromIndex: number) => void
  onDragEnd?: (fromIndex: number, toIndex: number) => void
  keyExtractor?: (photo: T, order: number) => any
  delayLongPress?: number
  pickerConfig?: SortablePhotosPickerConfig
  multiple?: boolean
  maxScale?: number
  minOpacity?: number
  scaleDuration?: number
  slideDuration?: number
  emptyIcon?: AppIcon
  style?: StyledProp<SortablePhotosComposition>
}
