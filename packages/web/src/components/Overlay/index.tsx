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

  if (!visible) return null
  return (
    // @ts-ignore
    <Component
      animated
      initial={variantStyles['wrapper:animation:hidden']}
      exit={variantStyles['wrapper:animation:hidden']}
      animate={variantStyles['wrapper:animation:visible']}
      css={[

        variantStyles.wrapper,
        visible ? variantStyles['wrapper:visible'] : variantStyles['wrapper:hidden'],
        { pointerEvents: 'none' },
      ]}
      transition={{

        type: 'tween',
        duration: 0.5,
        ease: 'easeIn',
      }}
      {...props}
    />
  )
}
