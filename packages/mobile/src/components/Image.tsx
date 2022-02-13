import * as React from 'react'
import {
  ComponentVariants,
  ImageStyles,
  MobileInputFile,
  useComponentStyle,
} from '@codeleap/common'
import { ComponentPropsWithoutRef } from 'react'
import {
  Image as NativeImage,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { FastImage } from '../modules/fastImage'

type NativeImageProps = ComponentPropsWithoutRef<typeof NativeImage>;
export type ImageProps = Omit<NativeImageProps, 'source' | 'style'> & {
  variants?: ComponentVariants<typeof ImageStyles>['variants'];
  fast?: boolean;
  style?: StyleProp<ImageStyle | TextStyle | ViewStyle>;
  source:
    | (NativeImageProps['source'] & {
        priority?: keyof typeof FastImage.priority;
      })
    | MobileInputFile
    | string;
  resizeMode?: keyof typeof FastImage.resizeMode;
};

export const Image: React.FC<ImageProps> = (props) => {
  const { variants, style, fast = true, resizeMode = 'contain', ...imageProps } = props

  const variantStyles = useComponentStyle('Image', { variants })

  const styles = [variantStyles.wrapper, style]

  if (fast) {
    return (
      <FastImage
        style={styles}
        resizeMode={FastImage.resizeMode[resizeMode || 'contain']}
        {...imageProps}
      />
    )
  }
  return <NativeImage style={styles} resizeMode={resizeMode} {...(imageProps as any)} />
}
