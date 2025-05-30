import React from 'react'
import { TypeGuards } from '@codeleap/types'
import { arePropsEqual } from '@codeleap/utils'
import { Image as NativeImage } from 'react-native'
import { useImageSpotlight } from '../ImageView/Spotlight'
import { Touchable } from '../Touchable'
import { isFile, toMultipartFile } from '../../utils'
import { LoadingOverlay } from '../LoadingOverlay'
import FastImage from '@d11/react-native-fast-image'
import { ImageProps } from './types'
import { AnyRecord, useNestedStylesByKey, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const Image = React.memo((props: ImageProps) => {
  const {
    style,
    fast,
    spotlight = null,
    resizeMode,
    source,
    withLoadingOverlay,
    maintainAspectRatio,
    touchProps,
    ...imageProps
  } = {
    ...Image.defaultProps,
    ...props,
  }

  const [loading, setLoading] = React.useState(false)

  const styles = useStylesFor(Image.styleRegistryName, style)

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
    style: styles.touchable,
    android_ripple: null,
    ...touchProps,
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

  const overlayStyle = useNestedStylesByKey('overlay', styles)

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
        resizeMode={resizeMode}
        source={imSource}
        {...(imageProps as any)}
        {...loadProps.current}
        style={[aspectRatioStyle, styles.wrapper]}
      />

      {loadingElement}
    </Wrapper>
  )
}, (prevProps, nextProps) => {
  const equal = arePropsEqual(prevProps, nextProps, { check: ['source', 'style', 'resizeMode', 'fast'] })
  return equal
}) as StyledComponentWithProps<ImageProps>

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
