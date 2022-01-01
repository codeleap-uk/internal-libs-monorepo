/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useComponentStyle, ButtonStyles, ComponentVariants, ButtonComposition, useStyle } from '@codeleap/common';
import React, { ComponentPropsWithRef } from 'react'
import { StylesOf } from '../types/utility'; 
import { Text } from './Text';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { ActivityIndicator } from './ActivityIndicator';
import { IconPlaceholder } from '@codeleap/common/dist/styles/icons';

type NativeButtonProps = ComponentPropsWithRef<'button'> 

export type ButtonProps = NativeButtonProps &  ComponentVariants<typeof ButtonStyles>  & {  
  text?:string
  rightIcon?: IconPlaceholder
  onPress:NativeButtonProps['onClick']
  styles?: StylesOf<ButtonComposition>
  loading?: boolean
  
} 


export const Button:React.FC<ButtonProps> = (buttonProps) => {
  const { variants = [], responsiveVariants = {}, children, text, loading, styles, onPress, rightIcon,  ...props } = buttonProps
  
  
  const variantStyles = useComponentStyle('Button', {
    responsiveVariants,
    variants,
    styles,
  })  


  function handlePress(e:Parameters<ButtonProps['onPress']>[0]){
    props.onClick && props.onClick(e)
    onPress && onPress(e)
  }
  const { Theme} = useStyle()
  return (
    <Touchable
      {...props}
      component='button'
      css={variantStyles.wrapper}
      onClick={handlePress}
    >
      {loading && <ActivityIndicator css={variantStyles.loader}/>}
      
      {children || <Text text={text} styles={{
        text: variantStyles.text,
      }}/>}
      <Icon name={rightIcon} style={variantStyles.icon}/>
     
    </Touchable>
  )
}
