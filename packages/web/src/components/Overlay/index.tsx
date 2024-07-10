import React from 'react'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { usePopState } from '../../lib'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { OverlayProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const Overlay = (overlayProps: OverlayProps) => {
  const {
    visible,
    style,
    ...props
  } = {
    ...Overlay.defaultProps,
    ...overlayProps,
  }

  const styles = useStylesFor(Overlay.styleRegistryName, style)

  usePopState(visible, props?.onPress)

  const isPressable = !!props?.onClick || !!props?.onPress
  const Component = isPressable ? Touchable : View

  return (
    // @ts-expect-error
    <Component
      {...props}
      style={[
        { transition: 'opacity 0.2s ease' },
        styles.wrapper,
        visible ? styles['wrapper:visible'] : null,
      ]}
    />
  )
}

Overlay.styleRegistryName = 'Overlay'
Overlay.elements = ['wrapper']
Overlay.rootElement = 'wrapper'

Overlay.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Overlay as (props: StyledComponentProps<OverlayProps, typeof styles>) => IJSX
}

Overlay.defaultProps = {} as Partial<OverlayProps>

WebStyleRegistry.registerComponent(Overlay)
