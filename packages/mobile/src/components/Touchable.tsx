import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { ComponentVariants, useComponentStyle, BaseViewProps, ViewStyles, useStyle } from '@codeleap/common'
import { View } from '@codeleap/mobile/src'
import { Animated, TouchableOpacity as NativeTouchable } from  'react-native'

export type TouchableProps =
  ComponentPropsWithoutRef<typeof NativeTouchable> & 
{
  variants?: ComponentVariants <typeof ViewStyles>['variants'],
  component?: any
} & BaseViewProps

export const Touchable = forwardRef<NativeTouchable, TouchableProps>((touchableProps, ref) => {
  const { 
    variants = [],
    children,
    onPress,
    style,
    ...props
  } = touchableProps
  
  const variantStyles = useComponentStyle('View', {
    variants,
  })
  const {logger} = useStyle()
  const press = () => {
    logger.log('<Touchable/> pressed', touchableProps, 'Component')
    onPress(null)
  }
  
  const styles = [variantStyles.wrapper, style]

  return <NativeTouchable onPress={press}  ref={ref}> 
    <View {...props} style={styles}>
      {children}
    </View>
  </NativeTouchable>
})

export type AnimatedTouchableProps =
ComponentPropsWithoutRef<typeof Animated.View> & 
TouchableProps

export const AnimatedTouchable = forwardRef<typeof Animated.View, AnimatedTouchableProps>((viewProps, ref) => {
  // @ts-ignore
  return <Touchable
    component={Animated.View}
   
    {...viewProps} 
  /> 
  
})