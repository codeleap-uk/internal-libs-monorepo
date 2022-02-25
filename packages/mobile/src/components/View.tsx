import * as React from 'react'
import * as Animatable from 'react-native-animatable'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  ViewStyles,
  BaseViewProps,
} from '@codeleap/common'
import { View as NativeView, ViewStyle } from 'react-native'

export type ViewProps = ComponentPropsWithoutRef<typeof NativeView> &
  ComponentVariants<typeof ViewStyles> & {
    ref?: any
    component?: any
  } & BaseViewProps

export const View: React.FC<ViewProps> = forwardRef<NativeView, ViewProps>((viewProps, ref) => {
  const {
    responsiveVariants = {},
    variants = [],
    children,
    style,
    onHover,
    component,
    ...props
  } = viewProps

  const variantStyles = useDefaultComponentStyle('View', {
    responsiveVariants,
    variants,
  })
  const Component = component || NativeView

  return (
    <Component style={[variantStyles.wrapper, style]} ref={ref} {...props}>
      {children}
    </Component>
  )
})

export const AnimatedView = Animatable.createAnimatableComponent(
  View,
) as unknown as React.ForwardRefExoticComponent<
  { transition?: any; animation?: any } & ViewProps
>
