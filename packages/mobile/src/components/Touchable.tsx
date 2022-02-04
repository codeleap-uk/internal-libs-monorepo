import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { ComponentVariants, useComponentStyle, BaseViewProps, ViewStyles, useStyle } from '@codeleap/common'
import { View } from './View'
import { Animated, TouchableOpacity as NativeTouchable } from  'react-native'
import { useLogStyles } from '../utils/styles'

export type TouchableProps =
  ComponentPropsWithoutRef<typeof NativeTouchable> & 
{
  variants?: ComponentVariants <typeof ViewStyles>['variants'],
  component?: any
  ref?: React.Ref<NativeTouchable>
  debugName?:string
} & BaseViewProps

export const Touchable:React.FC<TouchableProps> = forwardRef<NativeTouchable, TouchableProps>((touchableProps, ref) => {
  const { 
    variants = [],
    children,
    onPress,
    style,
    debugName,
    ...props
  } = touchableProps
  
  const variantStyles = useComponentStyle('View', {
    variants,
  })
  const {logger} = useStyle()
  const press = () => {
    if(!onPress) throw {message: 'No onPress passed to touchable', touchableProps}
    logger.log('<Touchable/> pressed', { style, variants }, 'Component')
    onPress(null)
  }
  
  const styles = [variantStyles.wrapper, style]

  const logStyles = useLogStyles()
  if(debugName){
    logStyles('Touchable: ' + debugName, style )
  }

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