import React, { CSSProperties } from 'react'
import { ActivityIndicator as RNActivityIndicator } from 'react-native'
import { ActivityIndicatorProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../hooks'
import { ActionIconProps } from '../ActionIcon'

export * from './styles'
export * from './types'

export const ActivityIndicator = <T extends React.ComponentType = typeof RNActivityIndicator>(props: ActivityIndicatorProps<T>) => {
  const {
    style,
    component: Component = RNActivityIndicator,
    ...rest
  } = {
    ...ActivityIndicator.defaultProps,
    ...props,
  }

  const styles = useStylesFor(ActivityIndicator.styleRegistryName, style)

  const wrapperStyle = styles?.wrapper as CSSProperties

  const color = wrapperStyle?.color || '#000'
  const size = (wrapperStyle?.height || wrapperStyle?.width || 'large') as number

  return (
    <Component
      size={size}
      color={color}
      {...rest}
      style={styles?.wrapper}
    />
  )
}

ActivityIndicator.styleRegistryName = 'ActivityIndicator'
ActivityIndicator.elements = ['wrapper']
ActivityIndicator.rootElement = 'wrapper'
ActivityIndicator.defaultProps = {} as Partial<ActionIconProps>

ActivityIndicator.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ActivityIndicator as (<T extends React.ComponentType = typeof RNActivityIndicator>(props: StyledComponentProps<ActivityIndicatorProps<T>, typeof styles>) => IJSX)
}

MobileStyleRegistry.registerComponent(ActivityIndicator)
