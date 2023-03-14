import * as React from 'react'
import {
  ComponentVariants,

  useDefaultComponentStyle,
  arePropsEqual,
  FormTypes,
  TypeGuards,
  useBooleanToggle,
  getNestedStylesByKey,
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
  ImageComposition,
  ImageStyles,
} from './styles'
import { useImageSpotlight } from '../ImageView/Spotlight'
import { Touchable } from '../Touchable'
import { isFile, toMultipartFile } from '../../utils'
import { LoadingOverlay, LoadingOverlayProps } from '../LoadingOverlay'
import { StylesOf } from '../../types'
export * from './styles'
type NativeImageProps = ComponentPropsWithoutRef<typeof NativeImage>
export type ImageProps = Omit<NativeImageProps, 'source' | 'style'> & {
  variants?: ComponentVariants<typeof ImageStyles>['variants']
  fast?: boolean
  styles?: StylesOf<ImageComposition>
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
  maintainAspectRatio?: boolean
  withLoadingOverlay?: boolean | React.FC<LoadingOverlayProps>
}




export const ImageComponent: React.FC<ImageProps> = (props) => {
  const {
    variants,
    style,
    styles: componentStyleSheet = {},
    fast = true,
    spotlight = null,
    resizeMode = 'contain',
    source,
    withLoadingOverlay = false,
    maintainAspectRatio = true,
    ...imageProps
  } = props

  const variantStyles = useDefaultComponentStyle<'u:Image', typeof ImageStyles>('u:Image', { variants, styles: componentStyleSheet,transform: StyleSheet.flatten })
  const [loading, setLoading] = React.useState(false)

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
    if (!maintainAspectRatio|| !imSource) return null
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

  }, [maintainAspectRatio, imSource])

  const loadEndedEarly = React.useRef(false)

  const loadProps = React.useRef({
    onLoadStart: () => {
      if(withLoadingOverlay) {
        setTimeout(() => {
          if(!loadEndedEarly.current){
            setLoading(true)
          }
        },60)
      }
    }, onLoadEnd: () => {
      loadEndedEarly.current = true
      if(withLoadingOverlay) setLoading(false)
    }
  })

  const Loading = TypeGuards.isFunction(withLoadingOverlay) ? withLoadingOverlay : LoadingOverlay
  const showLoading = !!withLoadingOverlay

  const overlayStyle = React.useMemo(() => getNestedStylesByKey('overlay', variantStyles), [variantStyles])

  const loadingElement = React.useMemo(() =>  {
    return showLoading ? (
      <Loading visible={loading} styles={overlayStyle}/>
  
      ) : null
  }, [showLoading, loading])
    
  
  if (fast) {
    return (
      <Wrapper {...wrapperProps}>

        <FastImage
          style={[aspectRatioStyle, styles]}
          // @ts-ignore
          tintColor={styles?.tintColor}
          source={imSource}
          resizeMode={FastImage.resizeMode[resizeMode || 'contain']}
          {...loadProps.current}
          {...imageProps}
        />
        {loadingElement}
      </Wrapper>
    )
  }
  return <Wrapper {...wrapperProps}>
    <NativeImage 
      style={[aspectRatioStyle, styles]} 
      resizeMode={resizeMode} 
      source={imSource} {...(imageProps as any)}  
      {...loadProps.current}
    />
    {
      loadingElement
    }
  </Wrapper>
}

function areEqual(prevProps, nextProps) {
  const check = ['source', 'style', 'variants', 'resizeMode', 'fast']
  const res = arePropsEqual(prevProps, nextProps, { check })
  return res
}

export const Image = React.memo(ImageComponent, areEqual)

