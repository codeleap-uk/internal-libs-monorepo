import React from 'react'
import {
  ComponentVariants,
  StylesOf,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { Touchable, TouchableProps } from '../Touchable'
import { View, ViewProps } from '../View'
import { OverlayComposition, OverlayPresets } from './styles'
import { NativeHTMLElement } from '../../types'
import { usePopState } from '../../lib'

export type OverlayProps<T extends NativeHTMLElement = 'div'> = {
  visible?: boolean
  styles?: StylesOf<OverlayComposition>
  onPress?: TouchableProps<'div'>['onClick']
} & ComponentVariants<typeof OverlayPresets> & Omit<ViewProps<T>, 'variants' | 'responsiveVariants'>

export * from './styles'

export const Overlay = <T extends NativeHTMLElement>(overlayProps:OverlayProps<T>) => {
  const { 
    visible, 
    responsiveVariants, 
    variants, 
    styles, 
    ...props 
  } = overlayProps

  const variantStyles = useDefaultComponentStyle('Overlay', {
    variants,
    responsiveVariants,
    styles,
  })

  usePopState(visible, props.onPress)

  const Component = props.onClick || props.onPress ? Touchable : View

  return (
    // @ts-ignore
    <Component
      css={[
        { transition: 'opacity 0.2s ease' },
        variantStyles.wrapper,
        visible ? variantStyles['wrapper:visible'] : {},
      ]}
      {...props}
    />
  )
}
