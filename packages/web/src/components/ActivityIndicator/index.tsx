import { View } from '../View'
import React, { forwardRef } from 'react'
import { TypeGuards } from '@codeleap/common'
import { ActivityIndicatorProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'

export const ActivityIndicatorCP = (props: ActivityIndicatorProps, ref) => {

  const {
    style = {},
    component: Component,
    size,
  } = {
    ...ActivityIndicatorCP.defaultProps,
    ...props,
  }

  const styles = useStylesFor(ActivityIndicatorCP.styleRegistryName, style)

  const _size = React.useMemo(() => {
    return TypeGuards.isNumber(size) ? {
      width: size,
      height: size,
    } : {}
  }, [size])

  return (
    <View style={[styles.wrapper, _size, style]}>
      <Component
        ref={ref}
        css={[styles.wrapper, _size, style]}
        {...props}
      />
    </View>
  )
}

ActivityIndicatorCP.styleRegistryName = 'ActivityIndicator'

ActivityIndicatorCP.elements = ['wrapper']

ActivityIndicatorCP.rootElement = 'wrapper'

ActivityIndicatorCP.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ActivityIndicatorCP as (props: StyledComponentProps<ActivityIndicatorProps, typeof styles>) => IJSX
}

ActivityIndicatorCP.defaultProps = {
  component: View as ActivityIndicatorProps['component'],
  size: null,
} as Partial<ActivityIndicatorProps>

WebStyleRegistry.registerComponent(ActivityIndicatorCP)

export const ActivityIndicator = forwardRef(ActivityIndicatorCP) as ((activityIndicatorProps: ActivityIndicatorProps) => JSX.Element) & {
  defaultProps: Partial<ActivityIndicatorProps>
}

export * from './styles'
export * from './types'
