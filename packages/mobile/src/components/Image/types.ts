import { LoadingOverlayProps } from '../LoadingOverlay'
import FastImage, { FastImageProps } from '@d11/react-native-fast-image'
import { ImageComposition } from './styles'
import { StyledProp } from '@codeleap/styles'

export type ImageProps =
  Omit<FastImageProps, 'style' | 'resizeMode'> &
  {
    fast?: boolean
    style?: StyledProp<ImageComposition>
    resizeMode?: keyof typeof FastImage.resizeMode
    spotlight?: string
    maintainAspectRatio?: boolean
    withLoadingOverlay?: boolean | ((props: LoadingOverlayProps) => JSX.Element)
  }