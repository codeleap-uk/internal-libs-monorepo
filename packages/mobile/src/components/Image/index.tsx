import * as React from 'react'
import {
  ComponentVariants,

  MobileInputFile,
  useDefaultComponentStyle,
  arePropsEqual,
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
    | MobileInputFile
    | string
  resizeMode?: keyof typeof FastImage.resizeMode
  spotlight?: string
}

export const ImageComponent: React.FC<ImageProps> = (props) => {
  const { variants, style, fast = true, spotlight = null, resizeMode = 'contain', ...imageProps } = props

  const variantStyles = useDefaultComponentStyle<'u:Image', typeof ImageStyles>('u:Image', { variants })

  const styles = StyleSheet.flatten([variantStyles.wrapper, style])

  const spotlightActions = useImageSpotlight(spotlight, props.source)
  const Wrapper = !!spotlight ? Touchable : ({ children }) => <>{children}</>
  const wrapperProps = {
    onPress: spotlightActions.onImagePressed,
    debugName: `Press spotlight image ${props.source}`,
    style: [variantStyles.touchable],
    android_ripple: null,
  }

  if (fast) {
    <Wrapper {...wrapperProps}>
    return (

      <FastImage
        style={styles}
        // @ts-ignore
        tintColor={styles?.tintColor}
        resizeMode={FastImage.resizeMode[resizeMode || 'contain']}
        {...imageProps}
      />
    )
    </Wrapper>
  }
  return <Wrapper {...wrapperProps}>
    <NativeImage style={styles} resizeMode={resizeMode} {...(imageProps as any)} />

  </Wrapper>
}

function areEqual(prevProps, nextProps) {
  const check = ['source', 'style', 'variants', 'resizeMode', 'fast']
  const res = arePropsEqual(prevProps, nextProps, { check })
  return res
}

export const Image = React.memo(ImageComponent, areEqual)

