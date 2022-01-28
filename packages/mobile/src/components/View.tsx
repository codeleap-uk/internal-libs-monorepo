import * as React from 'react';
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { ComponentVariants, useComponentStyle, ViewStyles, BaseViewProps } from '@codeleap/common'
import { Animated, View as NativeView } from  'react-native'

export type ViewProps =
 ComponentPropsWithoutRef<typeof NativeView> & 
 ComponentVariants<typeof ViewStyles> & {
  
    component?: any
} & BaseViewProps


export const View = forwardRef<NativeView, ViewProps>((viewProps, ref) => {
  const { 
    responsiveVariants = {}, 
    variants = [], 
    children,
    style,
    onHover,
    component,
    ...props
  } = viewProps;
  
  const variantStyles = useComponentStyle('View', {
    responsiveVariants,
    variants,
  });
  const Component  = component|| NativeView 

  return <Component
    
    style={[variantStyles.wrapper, style]} 
    ref={ref}
    {...props} 
  > 
    {children}
  </Component>
})

export type AnimatedViewProps =
ComponentPropsWithoutRef<typeof Animated.View> & 
ComponentVariants<typeof ViewStyles>  & BaseViewProps

export const AnimatedView = forwardRef<typeof Animated.View, AnimatedViewProps>((viewProps, ref) => {
  // @ts-ignore
  return <View
    component={Animated.View}
   
    {...viewProps} 
  /> 
  
})