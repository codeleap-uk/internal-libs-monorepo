import React, { ComponentPropsWithoutRef, forwardRef } from 'react'
import { TouchableComposition, TouchableStyles, useComponentStyle, useStyle, VariantProp } from '@codeleap/common';
import {  Pressable as NativeTouchable, GestureResponderEvent } from 'react-native'
import { StylesOf } from '../types/utility';



export type TouchableProps = {  
  disabled?:boolean
  variants?: VariantProp<typeof TouchableStyles>
  styles?: StylesOf<TouchableComposition>
} & ComponentPropsWithoutRef<typeof NativeTouchable>

export const Touchable = forwardRef<typeof NativeTouchable, TouchableProps>((touchableProps, ref) => {
  const { children, disabled, onPress,  variants, styles, ...props } = touchableProps
    
  const {  logger } = useStyle()
    
  const handlePress = (event: GestureResponderEvent) => {

    if (disabled) return
    
    
    if (!onPress) throw new Error('No onPress passed to touchable')
    onPress && onPress(event)


    logger.log('Touchable pressed', JSON.stringify(touchableProps, null, 2)  ,'Component')
  }

  const variantStyles = useComponentStyle('Touchable', {
    variants,
    styles
  })

  return (
    <NativeTouchable
      style={[variantStyles.wrapper]}
      onPress={handlePress}
      {...props}
    >
      {children}
    </NativeTouchable>
  )
})
