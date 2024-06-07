import { View } from '../View'
import React, { forwardRef } from 'react'
import { TypeGuards } from '@codeleap/common'
import { ActivityIndicatorProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps, GenericStyledComponentAttributes } from '@codeleap/styles'
import { ComponentWithDefaultProps } from '../../types'

export const ActivityIndicator = forwardRef((props: ActivityIndicatorProps, ref) => {

  const {
    style,
    component: Component,
    size,
  } = {
    ...ActivityIndicator.defaultProps,
    ...props,
  }

  const styles = useStylesFor(ActivityIndicator.styleRegistryName, style)

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
        style={[styles.wrapper, _size, style]}
        {...props}
      />
    </View>
  )
}) as ComponentWithDefaultProps<ActivityIndicatorProps> & GenericStyledComponentAttributes<AnyRecord>

ActivityIndicator.styleRegistryName = 'ActivityIndicator'

ActivityIndicator.elements = ['wrapper']

ActivityIndicator.rootElement = 'wrapper'

ActivityIndicator.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ActivityIndicator as (props: StyledComponentProps<ActivityIndicatorProps, typeof styles>) => IJSX
}

ActivityIndicator.defaultProps = {
  component: View as ActivityIndicatorProps['component'],
  size: null,
} as Partial<ActivityIndicatorProps>

WebStyleRegistry.registerComponent(ActivityIndicator)

export * from './styles'
export * from './types'
