import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { ComponentVariants, useComponentStyle, BaseViewProps, TextStyles } from '@codeleap/common'
import { StyleSheet, Text as NativeText } from  'react-native'

export type TextProps =
  ComponentPropsWithoutRef<typeof NativeText> & 
{
  text?: string,
  variants?: ComponentVariants <typeof TextStyles>['variants'],
} & BaseViewProps

export const Text = forwardRef<NativeText, TextProps>((textProps, ref) => {
  const { 
    variants = [], 
    text,
    style,
    ...props
  } = textProps
  
  const variantStyles = useComponentStyle('Text', {
    variants,
    rootElement : 'text'
  })
  
  const styles = [variantStyles.text, style]
  return <NativeText  {...props} style={styles} ref={ref}> 
    {text}
  </NativeText>
})