import React from 'react'
import { arePropsEqual, TypeGuards } from '@codeleap/common'
import { Image as NativeImage } from 'react-native'
import { useImageSpotlight } from '../ImageView/Spotlight'
import { Touchable } from '../Touchable'
import { isFile, toMultipartFile } from '../../utils'
import { LoadingOverlay } from '../LoadingOverlay'
import FastImage from 'react-native-fast-image'
import { ImageProps } from './types'
import { AnyRecord, GenericStyledComponentAttributes, getNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { ComponentWithDefaultProps } from 'src/types'

export * from './styles'
export * from './types'

export const ImageComponent = (props: ImageProps) => {
  const {
    style,
    fast,
    spotlight = null,
    resizeMode,
    source,
    withLoadingOverlay,
    maintainAspectRatio,
    ...imageProps
  } = {
    ...Image.defaultProps,
    ...props,
  }

  const [loading, setLoading] = React.useState(false)

  const styles = MobileStyleRegistry.current.styleFor(Image.styleRegistryName, style)

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
    style: [styles.touchable],
    android_ripple: null,
  }

  const aspectRatioStyle = React.useMemo(() => {
    if (!maintainAspectRatio || !imSource) return null
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
      if (withLoadingOverlay) {
        setTimeout(() => {
          if (!loadEndedEarly.current) {
            setLoading(true)
          }
        }, 60)
      }
    }, onLoadEnd: () => {
      loadEndedEarly.current = true
      if (withLoadingOverlay) setLoading(false)
    },
  })

  const Loading = TypeGuards.isFunction(withLoadingOverlay) ? withLoadingOverlay : LoadingOverlay
  const showLoading = !!withLoadingOverlay

  const overlayStyle = getNestedStylesByKey('overlay', styles)

  const loadingElement = React.useMemo(() => {
    return showLoading ? (
      <Loading visible={loading} style={overlayStyle} />
    ) : null
  }, [showLoading, loading])

  if (fast) {
    return (
      <Wrapper {...wrapperProps}>
        <FastImage
          style={[aspectRatioStyle, styles.wrapper]}
          // @ts-ignore
          tintColor={styles?.wrapper?.tintColor}
          // @ts-ignore
          source={imSource}
          resizeMode={FastImage.resizeMode[resizeMode || 'contain']}
          {...loadProps.current}
          {...imageProps}
        />
        {loadingElement}
      </Wrapper>
    )
  }

  return (
    <Wrapper {...wrapperProps}>
      <NativeImage
        style={[aspectRatioStyle, styles.wrapper]}
        resizeMode={resizeMode}
        source={imSource}
        {...(imageProps as any)}
        {...loadProps.current}
      />
      {loadingElement}
    </Wrapper>
  )
}

function areEqual(prevProps, nextProps) {
  const check = ['source', 'style', 'variants', 'resizeMode', 'fast']
  const res = arePropsEqual(prevProps, nextProps, { check })
  return res
}

export const Image = React.memo(ImageComponent, areEqual) as unknown as ComponentWithDefaultProps<ImageProps> & GenericStyledComponentAttributes<AnyRecord>

Image.styleRegistryName = 'Image'
Image.elements = ['wrapper', 'touchable', 'overlay']
Image.rootElement = 'wrapper'

Image.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Image as (props: StyledComponentProps<ImageProps, typeof styles>) => IJSX
}

Image.defaultProps = {
  fast: true,
  resizeMode: 'contain',
  withLoadingOverlay: false,
  maintainAspectRatio: true,
}

MobileStyleRegistry.registerComponent(Image)
