import { View } from '../View'
import React, { forwardRef } from 'react'
import { TypeGuards } from '@codeleap/types'
import { ActivityIndicatorProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const ActivityIndicator = forwardRef<HTMLDivElement, ActivityIndicatorProps>((props, ref) => {
  const {
    style,
    component: Component,
    size,
    ...rest
  } = {
    ...ActivityIndicator.defaultProps,
    ...props,
  }

  const styles = useStylesFor(ActivityIndicator.styleRegistryName, style)

  const _size = React.useMemo(() => {
    return TypeGuards.isNumber(size) ? {
      width: size,
      height: size,
    } : null
  }, [size])

  return (
    <Component
      ref={ref}
      {...rest}
      style={[styles.wrapper, _size]}
    />
  )
}) as StyledComponentWithProps<ActivityIndicatorProps>

ActivityIndicator.styleRegistryName = 'ActivityIndicator'
ActivityIndicator.elements = ['wrapper']
ActivityIndicator.rootElement = 'wrapper'

ActivityIndicator.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ActivityIndicator as (props: StyledComponentProps<ActivityIndicatorProps, typeof styles>) => IJSX
}

ActivityIndicator.defaultProps = {
  component: View,
  size: null,
} as Partial<ActivityIndicatorProps>

WebStyleRegistry.registerComponent(ActivityIndicator)
