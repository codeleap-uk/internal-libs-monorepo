import * as React from 'react';
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { ComponentVariants, useComponentStyle, ViewStyles, BaseViewProps } from '@codeleap/common'
import { View as NativeView } from  'react-native'

export type ViewProps =
 ComponentPropsWithoutRef<typeof NativeView> & 
 ComponentVariants<typeof ViewStyles> & {
    css?: any
} & BaseViewProps


export const View = forwardRef<NativeView, ViewProps>((viewProps, ref) => {

  const { 
    responsiveVariants = {}, 
    variants = [], 
    children,
    style,
    onHover,
    ...props
  } = viewProps;
  
  const variantStyles = useComponentStyle('View', {
    responsiveVariants,
    variants,
  });

  return <NativeView  
    style={[variantStyles.wrapper, style]} 
    ref={ref}
    {...props} 
  > 
    {children}
  </NativeView>
  return null
})
