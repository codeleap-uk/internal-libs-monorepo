import React from 'react'
import { View as RNView } from 'react-native'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import Animated from 'react-native-reanimated'
import { ViewProps } from './types'
import { useStylesFor } from '../../hooks'

export * from './types'
export * from './styles'

export const View = <T extends React.ComponentType = typeof RNView>(props: ViewProps<T>) => {
  const { 
    style, 
    component: _Component = RNView,
    animated = false,
    animatedStyle,
    ...viewProps
  } = props

  const styles = useStylesFor(View.styleRegistryName, style)

  const Component: React.ComponentType<any> = animated ? Animated.View : _Component

  return (
    <Component {...viewProps} style={[styles.wrapper, animatedStyle]} />
  )
}

View.styleRegistryName = 'View'
View.elements = ['wrapper']
View.rootElement = 'wrapper'

View.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return View as (<T extends React.ComponentType = typeof RNView>(props: StyledComponentProps<ViewProps<T>, typeof styles>) => IJSX)
}

MobileStyleRegistry.registerComponent(View)
