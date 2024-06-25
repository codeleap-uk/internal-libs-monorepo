import React from 'react'
import { View } from '../View'
import { ActivityIndicator } from '../ActivityIndicator'
import { LoadingOverlayProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'

export * from './styles'
export * from './types'

export const LoadingOverlay = (props: LoadingOverlayProps) => {
  const {
    visible,
    children,
    style,
    indicatorProps,
    debugName,
    ...rest
  } = {
    ...LoadingOverlay.defaultProps,
    ...props,
  }

  const styles = useStylesFor(LoadingOverlay.styleRegistryName, style)

  const indicatorStyles = useNestedStylesByKey('indicator', styles)

  return (
    <View {...rest} style={[styles.wrapper, visible && styles['wrapper:visible']]}>
      <ActivityIndicator debugName={debugName} {...indicatorProps} style={indicatorStyles} />
      {children}
    </View>
  )
}

LoadingOverlay.styleRegistryName = 'LoadingOverlay'
LoadingOverlay.elements = ['wrapper', 'indicator']
LoadingOverlay.rootElement = 'wrapper'

LoadingOverlay.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return LoadingOverlay as (props: StyledComponentProps<LoadingOverlayProps, typeof styles>) => IJSX
}

LoadingOverlay.defaultProps = {} as Partial<LoadingOverlayProps>

WebStyleRegistry.registerComponent(LoadingOverlay)
