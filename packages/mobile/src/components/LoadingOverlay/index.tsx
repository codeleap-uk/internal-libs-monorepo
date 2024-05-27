import React, { useRef } from 'react'
import { ActivityIndicator } from '../ActivityIndicator'
import { View } from '../View'
import { useAnimatedVariantStyles } from '../../utils'
import { LoadingOverlayProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { AnyRecord, useNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const LoadingOverlay = (props: LoadingOverlayProps) => {
  const {
    children,
    visible,
    style,
  } = props

  const transition = useRef(null)

  const styles = useStylesFor(LoadingOverlay.styleRegistryName, style)

  const loaderStyles = useNestedStylesByKey('loader', styles)

  const wrapperAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['wrapper:visible', 'wrapper:hidden'],
    updater: (s) => {
      'worklet'
      return visible ? s['wrapper:visible'] : s['wrapper:hidden']
    },
    transition: styles.transition,
    dependencies: [visible],
  })

  if (!transition.current) {
    transition.current = JSON.parse(JSON.stringify(styles['wrapper:transition']))
  }

  return (
    <View
      animated
      animatedStyle={wrapperAnimation}
      style={styles.wrapper}
      // @ts-expect-error
      transition={transition.current}
    >
      <ActivityIndicator style={loaderStyles} />
      {children}
    </View>
  )
}

LoadingOverlay.styleRegistryName = 'LoadingOverlay'
LoadingOverlay.elements = ['wrapper', 'loader', 'transition']
LoadingOverlay.rootElement = 'wrapper'

LoadingOverlay.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return LoadingOverlay as (props: StyledComponentProps<LoadingOverlayProps, typeof styles>) => IJSX
}

MobileStyleRegistry.registerComponent(LoadingOverlay)
