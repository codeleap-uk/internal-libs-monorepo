import { LoadingOverlayProps } from '../LoadingOverlay'
import FastImage, { Source } from '@d11/react-native-fast-image'
import { ImageProps as RNImageProps } from 'react-native'
import { ImageComposition } from './styles'
import { StyledProp } from '@codeleap/styles'
import { FormTypes } from '@codeleap/common'

export type ImageProps =
  Omit<RNImageProps, 'source' | 'style'> &
  {
    fast?: boolean
    style?: StyledProp<ImageComposition>
    source: Source | FormTypes.AnyFile
    resizeMode?: keyof typeof FastImage.resizeMode
    spotlight?: string
    maintainAspectRatio?: boolean
    withLoadingOverlay?: boolean | ((props: LoadingOverlayProps) => JSX.Element)
  }
