/** @jsx jsx */
import {  jsx, CSSObject } from '@emotion/react'

import React, { ComponentPropsWithRef, ElementType } from 'react'
import { stopPropagation } from '../lib/utils/stopPropagation';
import { View } from './View';



export type TouchableProps<T extends ElementType> = ComponentPropsWithRef<T> &  {  
  css?:CSSObject
  component?: T
  disabled?:boolean
  propagate?: boolean
} 

export const Touchable = <T extends ElementType = 'div'>(touchableProps:TouchableProps<T>) => {
  const { children, propagate = true, component, disabled, onPress, ...props } = touchableProps
    
    

  const Component = component || View

  const handleClick = (event: React.MouseEvent<T>) => {

    if (disabled) return
    
    if (!propagate) stopPropagation(event)
    
    if (!props.onClick) throw new Error('No onClick passed to touchable')
    onPress && onPress()

    props.onClick(event)
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
