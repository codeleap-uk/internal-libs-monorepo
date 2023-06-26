import React from 'react'
import {
  ComponentVariants,
  SmartOmit,
  StylesOf,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { Touchable, TouchableProps } from '../Touchable'
import { View, ViewProps } from '../View'
import { OverlayComposition, OverlayPresets } from './styles'

export type OverlayProps = {
  visible?: boolean
  styles?: StylesOf<OverlayComposition>
  onPress?: TouchableProps<'div'>['onClick']
} & ComponentVariants<typeof OverlayPresets> &
  Partial<SmartOmit<ViewProps<'div'>, 'variants' | 'responsiveVariants'>>

export * from './styles'

export const Overlay: React.FC<OverlayProps> = (overlayProps) => {
  const { visible, responsiveVariants, variants, styles, ...props } =
    overlayProps

  const variantStyles = useDefaultComponentStyle('Overlay', {
    variants,
    responsiveVariants,
    styles,
  })

  const Component = props.onClick || props.onPress ? Touchable : View

  return (
    <Component
      css={{
        ...variantStyles.wrapper,
        transition: 'opacity 0.2s ease',
        ...(visible ? variantStyles['wrapper:visible'] : {}),
      }}
      {...props}
    />
  )
}
