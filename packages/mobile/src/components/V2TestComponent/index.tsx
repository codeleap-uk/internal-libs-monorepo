import React, { forwardRef } from 'react'
import { View } from 'react-native'
import { AnyRecord, GenericStyledComponent, IJSX, StyleProp, StyledComponentProps } from '@codeleap/styles'
import { ViewV2Composition } from './styles'
import { MobileStyleRegistry } from '../../Registry'
import { PropsOf } from '@codeleap/common'

type ViewV2Props<T extends React.ComponentType = typeof View> = {
  component?: T
  style?: StyleProp<ViewV2Composition>

} & PropsOf<T>

export * from './styles'

export const ViewV2 = <T extends React.ComponentType = typeof View>(props: ViewV2Props<T>) => {
  const { style, component: Component = View } = props

  const styles = MobileStyleRegistry.current.styleFor(ViewV2.styleRegistryName, style)

  return (
    <Component {...props} style={[styles.wrapper]} />
  )
}

ViewV2.styleRegistryName = 'ViewV2'

ViewV2.elements = ['wrapper']

ViewV2.rootElement = 'wrapper'

// If this component wasn't polymorphic, we could just do:
// ViewV2.withVariantTypes = () => ViewV2

ViewV2.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ViewV2 as (<T extends React.ComponentType = typeof View>(props: StyledComponentProps<ViewV2Props<T>, typeof styles>) => IJSX)
}

MobileStyleRegistry.registerComponent(ViewV2)

