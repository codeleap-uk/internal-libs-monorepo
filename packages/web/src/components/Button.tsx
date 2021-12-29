/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useComponentStyle, ButtonStyles, ComponentVariants, ButtonComposition, useStyle } from '@codeleap/common';
import React, { ComponentPropsWithRef } from 'react'
import { StylesOf } from '../types/utility'; 
import { Text } from './Text';
import { Touchable } from './Touchable';

type NativeButtonProps = ComponentPropsWithRef<'button'> 

export type ButtonProps = NativeButtonProps &  ComponentVariants<typeof ButtonStyles>  & {  
  text:string
  rightIcon?: React.ReactNode 
  onPress:NativeButtonProps['onClick']
  styles?: StylesOf<ButtonComposition>
} 


export const Button:React.FC<ButtonProps> = (buttonProps) => {
  const { variants = [], responsiveVariants = {}, children, text,  styles, onPress,  ...props } = buttonProps
  const {logger} = useStyle()
  logger.warn('Button', buttonProps, 'Styles')
  const variantStyles = useComponentStyle('Button', {
    rootElement: 'wrapper',
    responsiveVariants,
    variants,
  })  

  function handlePress(e:Parameters<ButtonProps['onPress']>[0]){
    props.onClick && props.onClick(e)
    onPress && onPress(e)
  }

  return (
    <Touchable
      {...props}
      component='button'
      css={variantStyles.wrapper}
      onClick={handlePress}
    >
    
      {children || <Text text={text} style={{
        ...variantStyles.text,
        ...styles?.text,
      }}/>}
     
    </Touchable>
  )
}
