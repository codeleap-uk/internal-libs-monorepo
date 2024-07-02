import { View } from '../View'
import React, { forwardRef } from 'react'
import { TypeGuards } from '@codeleap/common'
import { ActivityIndicatorProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps, GenericStyledComponentAttributes } from '@codeleap/styles'
import { ComponentWithDefaultProps } from '../../types'

export * from './styles'
export * from './types'

export const ActivityIndicator = forwardRef<HTMLDivElement>((props: ActivityIndicatorProps, ref) => {
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
    <View style={[styles.wrapper, _size]}>
      <Component
        ref={ref}
        {...rest}
        style={[styles.wrapper, _size]}
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
  component: View,
  size: null,
} as Partial<ActivityIndicatorProps>

WebStyleRegistry.registerComponent(ActivityIndicator)
