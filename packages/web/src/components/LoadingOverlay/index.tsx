import { getNestedStylesByKey } from '@codeleap/common'
import React from 'react'
import { View } from '../View'
import { ActivityIndicator } from '../ActivityIndicator'
import { LoadingOverlayProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'

export const LoadingOverlay = (props: LoadingOverlayProps) => {

  const {
    visible,
    children,
    style,
    indicatorProps,
    debugName,
    ...rest
  } = props

  const styles = useStylesFor(LoadingOverlay.styleRegistryName, style)

  const indicatorStyles = React.useMemo(() => {
    return getNestedStylesByKey('indicator', styles)
  }, [styles])

  return (
    <View style={[styles.wrapper, visible && styles['wrapper:visible'], style]} {...rest}>
      <ActivityIndicator debugName={debugName} {...indicatorProps} styles={indicatorStyles} />
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

export * from './styles'
export * from './types'
