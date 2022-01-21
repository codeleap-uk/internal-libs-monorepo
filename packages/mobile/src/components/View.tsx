import { ComponentVariants, useComponentStyle, useStyle, ViewStyles, BaseViewProps } from '@codeleap/common'
import { ComponentPropsWithoutRef, forwardRef } from 'react';
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
    onHover,
    ...props
  } = viewProps;
  const variantStyles = useComponentStyle('View', {
    responsiveVariants,
    variants,
  });
  const { Theme } = useStyle();

  return <NativeView  
    style={[variantStyles.wrapper]} 
    ref={ref}
    {...props} 
  > 
    {children}
  </NativeView>
})
