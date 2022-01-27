import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { ComponentVariants, useComponentStyle, BaseViewProps, ViewStyles } from '@codeleap/common'
import { View } from '@codeleap/mobile/src'
import { TouchableOpacity as NativeTouchable } from  'react-native'

export type TouchableProps =
  ComponentPropsWithoutRef<typeof NativeTouchable> & 
{
  variants?: ComponentVariants <typeof ViewStyles>['variants'],
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

  const press = () => {
    console.log('<Touchable/> pressed', touchableProps)
    onPress(null)
  }
  
  const styles = [variantStyles.wrapper, style]

  return <NativeTouchable onPress={press}  ref={ref}> 
    <View {...props} style={styles}>
      {children}
    </View>
  </NativeTouchable>
})