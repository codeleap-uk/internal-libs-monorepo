/** @jsx jsx */
import { AnyFunction } from '@codeleap/common';
import {  jsx, CSSObject } from '@emotion/react'

import React, { ComponentPropsWithRef, ElementType } from 'react'
import { stopPropagation } from '../lib/utils/stopPropagation';
import { View } from './View';



export type TouchableProps<T extends ElementType> = ComponentPropsWithRef<T> &  {  
  css?:CSSObject
  component?: T
  disabled?:boolean
  propagate?: boolean
  onPress?: AnyFunction
} 

export const Touchable = <T extends ElementType = typeof View>(touchableProps:TouchableProps<T>) => {
  const { children, propagate = true, component: Component = View, disabled, onPress, onClick, ...props } = touchableProps
    
    
  const handleClick = (event: React.MouseEvent<T>) => {

    if (disabled) return
    
    if (!propagate) stopPropagation(event)
    
    if (!onClick && !onPress) throw new Error('No onClick or onPress passed to touchable')
    onPress && onPress()

    onClick && onClick(event)
  }

  return (
    <Component 
      {...props}
      
      onClick={handleClick}
    >
      {children}
    </Component>
  )
}
