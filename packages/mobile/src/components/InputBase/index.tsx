import React from 'react'
import { PropsOf, TypeGuards, getRenderedComponent, useDefaultComponentStyle, useNestedStylesByKey } from "@codeleap/common"
import { StyleSheet } from "react-native"
import { ActionIcon, ActionIconComposition, ActionIconProps } from "../ActionIcon"
import { View } from "../View"
import { InputBasePresets, useInputBaseStyles } from "./styles"
import { InputBaseProps } from "./types"
import { Text, TextProps } from '../Text'
import { Touchable } from '../Touchable'


export * from './styles'
export * from './utils'
export * from './types'

export const InputBaseDefaultOrder:InputBaseProps['order'] = [
  'label',
  'description',
  'innerWrapper',
  'error'
]
const KeyPassthrough = (props: React.PropsWithChildren<any>) => {
  return <>{props.children}</>
}

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
    order = InputBaseDefaultOrder,
    style,
    labelAsRow = false,
    innerWrapperRef,
    ...otherProps
  } = props

  const WrapperComponent = wrapper || View
  const InnerWrapperComponent = innerWrapper || View
  
  const _styles = useInputBaseStyles(props)
 
  const _leftIcon = getRenderedComponent<Partial<ActionIconProps>>(leftIcon, ActionIcon, {
    // @ts-ignore
    styles: _styles.leftIconStyles,
    debugName: `${debugName} left icon`,
  })
  
  const _rightIcon = getRenderedComponent<Partial<ActionIconProps>>(rightIcon, ActionIcon, {
    
    // @ts-ignore
    styles: _styles.rightIconStyles,
    debugName: `${debugName} right icon`
  })

  const _label = TypeGuards.isString(label) ? <Text text={label} style={_styles.labelStyle}/>  : label 

  
  const _error = TypeGuards.isString(error) ? <Text text={error} style={_styles.errorStyle}/>  : error


  const _description = TypeGuards.isString(description) ? <Text text={description} style={_styles.descriptionStyle}/>  : description
   

  const parts = {
    label:labelAsRow ? <View style={_styles.labelRowStyle}>
      {_label}
      {_description}
    </View>  :  _label,
    description: labelAsRow ? null : _description,
    innerWrapper:  <InnerWrapperComponent style={[
      _styles.innerWrapperStyle
    ]} {...innerWrapperProps} ref={innerWrapperRef}>
      {_leftIcon}
      {children}
      {_rightIcon}
    </InnerWrapperComponent>,
    error: _error || <Text text={''} style={_styles.errorStyle}/>
  }

  


  return <WrapperComponent 
    style={[_styles.wrapperStyle, style]} 
    {...otherProps}
    {...wrapperProps}
  >
    {
      order.map((key) => <KeyPassthrough key={key}>
        {parts[key]}
      </KeyPassthrough>)

    }
   
  
  </WrapperComponent>
})   