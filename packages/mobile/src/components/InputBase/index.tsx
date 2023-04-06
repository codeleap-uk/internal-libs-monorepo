import React from 'react'
import { PropsOf, TypeGuards, getRenderedComponent, useDefaultComponentStyle, useNestedStylesByKey } from "@codeleap/common"
import { StyleSheet } from "react-native"
import { ActionIcon, ActionIconComposition, ActionIconProps } from "../ActionIcon"
import { View } from "../View"
import { InputBasePresets, useInputBaseStyles } from "./styles"
import { InputBaseProps } from "./types"
import { Text, TextProps } from '../Text'


export * from './styles'
export * from './utils'
export * from './types'



export const InputBase = React.forwardRef<any, InputBaseProps>((props, ref) => {
  const { 
    children,
    error = null,
    label,
    description = null,
    leftIcon = null,
    rightIcon = null,
    styles,
    wrapper,
    debugName,
    innerWrapper,
    focused,
    innerWrapperProps = {},
    wrapperProps = {},
    disabled = false,
    ...otherProps
  } = props

  const WrapperComponent = wrapper || View
  const InnerWrapperComponent = innerWrapper || View
  
  const _styles = useInputBaseStyles(props)
 
  const _leftIcon = getRenderedComponent<ActionIconProps>(leftIcon, ActionIcon, {
    debugName,
    // @ts-ignore
    styles: _styles.leftIconStyles,
  })
  
  const _rightIcon = getRenderedComponent<ActionIconProps>(rightIcon, ActionIcon, {
    debugName,
    // @ts-ignore
    styles: _styles.rightIconStyles
  })

  const _label = TypeGuards.isString(label) ? <Text text={label} style={_styles.labelStyle}/>  : label 

  
  const _error = TypeGuards.isString(error) ? <Text text={error} style={_styles.errorStyle}/>  : error


  const _description = TypeGuards.isString(description) ? <Text text={description} style={_styles.descriptionStyle}/>  : description
  


  console.log({
    innerWrapperProps,
    
  })

  return <WrapperComponent 
    style={_styles.wrapperStyle} 
    {...otherProps}
    {...wrapperProps}
  >
    {_label}
    {_description}
    <InnerWrapperComponent style={[
      _styles.innerWrapperStyle
    ]} {...innerWrapperProps}>
      {_leftIcon}
      {children}
      {_rightIcon}
    </InnerWrapperComponent>
    {_error || <Text text={''} style={_styles.errorStyle}/>}
  </WrapperComponent>
})   