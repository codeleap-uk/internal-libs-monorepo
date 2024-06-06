import React from 'react'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { NativeHTMLElement } from '../../types'
import { WebStyleRegistry, usePopState } from '../../lib'
import { OverlayProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'

export const Overlay = <T extends NativeHTMLElement>(overlayProps:OverlayProps<T>) => {

  const {
    visible,
    style,
    ...props
  } = {
    ...Overlay.defaultProps,
    ...overlayProps,
  }

  const styles = useStylesFor(Overlay.styleRegistryName, style)

  usePopState(visible, props.onPress)

  const Component = props.onClick || props.onPress ? Touchable : View

  return (
    // @ts-ignore
    <Component
      style={[
        { transition: 'opacity 0.2s ease' },
        styles.wrapper,
        visible ? styles['wrapper:visible'] : {},
      ]}
      {...props}
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

export * from './styles'
export * from './types'

