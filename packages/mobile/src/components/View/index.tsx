import React, { forwardRef } from 'react'
import { View as RNView } from 'react-native'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import Animated from 'react-native-reanimated'
import { ViewProps } from './types'
import { useStylesFor } from '../../hooks'
import { useComponentTestId } from '@codeleap/hooks'

export * from './types'
export * from './styles'

export const View = forwardRef((props: ViewProps<T>, ref) => {
  const {
    style,
    component: _Component = RNView,
    animated = false,
    animatedStyle,
    // ref,
    ...viewProps
  } = props

  const styles = useStylesFor(View.styleRegistryName, style)

  const testId = useComponentTestId(View, props, ['style', 'component', 'children', 'animated'])

  const Component: React.ComponentType<AnyRecord> = animated ? Animated.View : _Component

  return (
    <Component testID={testId} {...viewProps} style={[styles.wrapper, animatedStyle]} ref={ref}/>
  )
})

View.Animated = (props: ViewProps<typeof Animated.View>) => {
  return <View {...props} animated />
}

View.styleRegistryName = 'View'
View.elements = ['wrapper']
View.rootElement = 'wrapper'

View.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return View as (<T extends React.ComponentType = typeof RNView>(props: StyledComponentProps<ViewProps<T>, typeof styles>) => IJSX)
}

MobileStyleRegistry.registerComponent(View)
