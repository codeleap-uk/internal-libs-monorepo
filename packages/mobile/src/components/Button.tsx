import * as React from 'react'
import { useComponentStyle, ButtonStyles, ComponentVariants, ButtonComposition } from '@codeleap/common';
import {  forwardRef } from 'react'
import { StylesOf } from '../types/utility'; 
import { Text } from './Text';
import { Touchable, TouchableProps } from './Touchable';
import { Icon } from './Icon';
import { ActivityIndicator } from './ActivityIndicator';
import { IconPlaceholder } from '@codeleap/common';
import { StyleSheet, TouchableOpacity } from 'react-native';




export type ButtonProps = Omit<TouchableProps,'variants'> & ComponentVariants<typeof ButtonStyles>  & {  
  text?:string
  rightIcon?: IconPlaceholder
  icon?: IconPlaceholder
  styles?: StylesOf<ButtonComposition>
  loading?: boolean
} 

export const Button = forwardRef<TouchableOpacity, ButtonProps>( (buttonProps,ref) => {
  const { 
    variants = [],
    responsiveVariants = {},
    children,
    icon,
    text,
    loading,
    styles = {},
    onPress,
    rightIcon,
    ...props 
  } = buttonProps
  
  
  const variantStyles = useComponentStyle('Button', {
    variants,
  })  


  function handlePress(e:Parameters<ButtonProps['onPress']>[0]){
    onPress && onPress(e)
  }

 
  return (
    <Touchable
      style={[variantStyles.wrapper, styles.wrapper]}
      onPress={handlePress}
      ref={ref}
      {...props}
    >
      {loading && <ActivityIndicator style={[variantStyles.loader, styles.loader]} />}
      {!loading && <Icon name={icon} style={StyleSheet.flatten([variantStyles.icon, styles.icon, variantStyles.leftIcon, styles.leftIcon])}/>}
      {children || <Text text={text} style={[variantStyles.text, styles.text]}/>}
      <Icon name={rightIcon} style={StyleSheet.flatten([variantStyles.icon, styles.icon, variantStyles.rightIcon, styles.rightIcon])}/>
    </Touchable>
  )
})
