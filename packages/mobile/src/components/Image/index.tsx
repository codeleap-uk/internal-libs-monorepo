import * as React from 'react'
import {
  ComponentVariants,

  useDefaultComponentStyle,
  arePropsEqual,
  FormTypes,
  TypeGuards,
} from '@codeleap/common'
import { ComponentPropsWithoutRef } from 'react'
import {
  Image as NativeImage,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { FastImage } from '../../modules/fastImage'
import {
  ImageStyles,
} from './styles'
import { useImageSpotlight } from '../ImageView/Spotlight'
import { Touchable } from '../Touchable'
import { isFile, toMultipartFile } from '../../utils'
export * from './styles'
type NativeImageProps = ComponentPropsWithoutRef<typeof NativeImage>
export type ImageProps = Omit<NativeImageProps, 'source' | 'style'> & {
  variants?: ComponentVariants<typeof ImageStyles>['variants']
  fast?: boolean
  style?: StyleProp<ImageStyle | TextStyle | ViewStyle>
  source:
    | (NativeImageProps['source'] & {
        priority?: keyof typeof FastImage.priority
      })
    | FormTypes.AnyFile
    | string
    | number
  resizeMode?: keyof typeof FastImage.resizeMode
  spotlight?: string
  maintainAspectRatioFrom?: 'width' | 'height' | 'none'
}

export const ImageComponent: React.FC<ImageProps> = (props) => {
  const {
    variants,
    style,
    fast = true,
    spotlight = null,
    resizeMode = 'contain',
    source,
    maintainAspectRatioFrom = 'height',
    ...imageProps
  } = props

  const variantStyles = useDefaultComponentStyle<'u:Image', typeof ImageStyles>('u:Image', { variants })

  const styles = StyleSheet.flatten([variantStyles.wrapper, style])
  let imSource = source
  if (isFile(imSource)) {
    imSource = toMultipartFile(imSource)
  } else if (TypeGuards.isString(source)) {
    imSource = { uri: source }
  }
  const spotlightActions = useImageSpotlight(spotlight, props.source)
  const Wrapper = !!spotlight ? Touchable : ({ children }) => <>{children}</>
  const wrapperProps = {
    onPress: spotlightActions.onImagePressed,
    debugName: `Press spotlight image ${props.source}`,
    style: [variantStyles.touchable],
    android_ripple: null,
  }

  const aspectRatioStyle = React.useMemo(() => {
    if (maintainAspectRatioFrom === 'none' || !imSource) return null
    try {
      // @ts-ignore
      const assetSource = NativeImage.resolveAssetSource(imSource)
      const aspectRatio = assetSource.width / assetSource.height

      if (Number.isNaN(aspectRatio)) {
        return null
      }
      return {
        aspectRatio,
      }
    } catch (e) {
      return null
    }

  }, [maintainAspectRatioFrom, imSource])

  if (fast) {
    return (
      <Wrapper {...wrapperProps}>

        <FastImage
          style={[aspectRatioStyle, styles]}
          // @ts-ignore
          tintColor={styles?.tintColor}
          source={imSource}
          resizeMode={FastImage.resizeMode[resizeMode || 'contain']}
          {...imageProps}
        />
      </Wrapper>
    )
  }
  return <Wrapper {...wrapperProps}>
    <NativeImage style={[aspectRatioStyle, styles]} resizeMode={resizeMode} source={imSource} {...(imageProps as any)} />

  </Wrapper>
}

function areEqual(prevProps, nextProps) {
  const check = ['source', 'style', 'variants', 'resizeMode', 'fast']
  const res = arePropsEqual(prevProps, nextProps, { check })
  return res
}

export const Image = React.memo(ImageComponent, areEqual)

