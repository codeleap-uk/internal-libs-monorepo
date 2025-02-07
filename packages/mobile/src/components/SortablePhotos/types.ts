import { AppIcon, ICSS, StyledProp } from '@codeleap/styles'
import { ReactElement } from 'react'
import { SortablePhotosComposition } from './styles'
import { type SortableGridProps } from 'react-native-sortables'

export type SortablePhoto = {
  filename: string | null
  file: string | null
}

export type WithId<T extends SortablePhoto> = T & {
  key: string
}

export type SortableItemProps<T extends SortablePhoto> = {
  photo: T
  order: number
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

export type SortablePhotosProps<T extends SortablePhoto> = Omit<SortableGridProps<T>, 'data' | 'columns'> & {
  numColumns?: number
  numPhotos?: number
  renderPhoto?: (props: SortableItemProps<T>) => ReactElement
  photos: T[]
  onChangePhotos: (newPhotos: T[]) => void
  gap?: number
  onPressPhoto?: (data: T[], photo: T, order: number) => void
  pickerConfig?: SortablePhotosPickerConfig
  multiple?: boolean
  emptyIcon?: AppIcon
  style?: StyledProp<SortablePhotosComposition>
  modalTitle?: string
  modalBody?: string
  modalLibraryText?: string
  modalCameraText?: string
  modalDeleteText?: string
  getFilename?: (file: string) => string
  loading?: boolean
}
