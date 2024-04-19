import React from 'react'
import { ActivityIndicator as RNActivityIndicator } from 'react-native'
import { ActivityIndicatorProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const ActivityIndicator = <T extends React.ComponentType = typeof RNActivityIndicator>(props: ActivityIndicatorProps<T>) => {
  const {
    style = {},
    component: Component = RNActivityIndicator,
    ...rest
  } = {
    ...ActivityIndicator.defaultProps,
    ...props,
  }

  const styles = MobileStyleRegistry.current.styleFor(ActivityIndicator.styleRegistryName, style)

  // @ts-expect-error
  const color = styles?.wrapper?.color || '#000'
  // @ts-expect-error
  const size = styles?.wrapper?.height || styles?.wrapper?.width || 'large'

  return (
    <Component
      size={size}
      color={color}
      style={styles?.wrapper}
      {...rest}
    />
  )
}

ActivityIndicator.styleRegistryName = 'ActivityIndicator'
ActivityIndicator.elements = ['wrapper', 'backCircle', 'frontCircle', 'circle']
ActivityIndicator.rootElement = 'wrapper'
ActivityIndicator.defaultProps = {}

ActivityIndicator.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ActivityIndicator as (<T extends React.ComponentType = typeof RNActivityIndicator>(props: StyledComponentProps<ActivityIndicatorProps<T>, typeof styles>) => IJSX)
}

MobileStyleRegistry.registerComponent(ActivityIndicator)
