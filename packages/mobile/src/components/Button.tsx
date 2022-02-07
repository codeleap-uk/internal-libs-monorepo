import * as React from 'react'
import { useComponentStyle, ButtonStyles, ComponentVariants, ButtonComposition, ButtonParts } from '@codeleap/common';
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
    disabled,
    rightIcon,
    ...props 
  } = buttonProps
  
  
  const variantStyles = useComponentStyle('Button', {
    variants,
    transform: StyleSheet.flatten,
    styles
  })  


  function handlePress(e:Parameters<ButtonProps['onPress']>[0]){
    onPress && onPress()
  }

  function getStyles(key: ButtonParts){
    console.log(disabled)
    return [
      variantStyles[key],
      disabled && variantStyles[key + ':disabled']
    ]
  }
  
  const iconStyle = getStyles('icon')

  return (
    <Touchable
      style={getStyles('wrapper')}
      onPress={handlePress}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {loading && <ActivityIndicator style={getStyles('loader')} />}
      {!loading && <Icon name={icon} style={StyleSheet.flatten([iconStyle, getStyles('leftIcon')])}/>}
      {text ? <Text text={text} style={getStyles('text')}/> : null}
      {children}
      <Icon name={rightIcon} style={StyleSheet.flatten([iconStyle, getStyles('rightIcon')])}/>
    </Touchable>
  )
})
