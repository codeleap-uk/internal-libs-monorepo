import React, { forwardRef } from 'react'
import { View as RNView } from 'react-native'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import Animated from 'react-native-reanimated'
import { ViewAnimatedProps, ViewProps } from './types'
import { useStylesFor } from '../../hooks'
import { useComponentTestId } from '@codeleap/hooks'

export * from './types'
export * from './styles'

export const View = forwardRef<RNView, ViewProps>((props, ref) => {
  const {
    style,
    animated = false,
    animatedStyle,
    ...viewProps
  } = props

  const styles = useStylesFor(View.styleRegistryName, style)

  const testId = useComponentTestId(View, props, ['style', 'children', 'animated'])

  const Component: React.ComponentType<AnyRecord> = animated ? Animated.View : RNView

  return (
    <Component
      testID={testId}
      {...viewProps}
      style={[styles.wrapper, animatedStyle]}
      ref={ref}
    />
  )
}) as StyledComponentWithProps<ViewProps> & { Animated?: (props: ViewAnimatedProps) => React.ReactElement }

View.Animated = (props: ViewAnimatedProps) => {
  return <View {...props} />
}

View.styleRegistryName = 'View'
View.elements = ['wrapper']
View.rootElement = 'wrapper'

View.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return View as (props: StyledComponentProps<ViewProps, typeof styles>) => IJSX
}

MobileStyleRegistry.registerComponent(View)