import React from 'react'
import { getRenderedComponent, useDefaultComponentStyle, useNestedStylesByKey } from "@codeleap/common"
import { StyleSheet } from "react-native"
import { ActionIcon, ActionIconComposition, ActionIconProps } from "../ActionIcon"
import { View } from "../View"
import { InputBasePresets } from "./styles"
import { InputBaseProps } from "./types"


export * from './styles'
export * from './types'

export const InputBase = React.forwardRef<any, InputBaseProps>((props, ref) => {
  const { 
    children,
    error,
    label,
    subtitle,
    leftIcon,
    rightIcon,
    styles,
    wrapper,
    debugName,
    innerWrapper,
  } = props

  const WrapperComponent = wrapper || View
  const InnerWrapperComponent = innerWrapper || View
  
  const variantStyles = useDefaultComponentStyle<'u:InputBase', typeof InputBasePresets>('u:InputBase', {
    styles,
    transform: StyleSheet.flatten,
    rootElement: 'wrapper'
  })

  const leftIconStyles = useNestedStylesByKey<ActionIconComposition>('leftIcon', variantStyles)
  const rightIconStyles = useNestedStylesByKey<ActionIconComposition>('rightIcon', variantStyles)

  const _leftIcon = getRenderedComponent<ActionIconProps>(leftIcon, ActionIcon, {
    styles: leftIconStyles,
    debugName
  })

  const _rightIcon = getRenderedComponent<ActionIconProps>(rightIcon, ActionIcon, {
    debugName,
    styles: rightIconStyles
  })


  return <WrapperComponent style={variantStyles.wrapper}>
    {label}
    <InnerWrapperComponent style={variantStyles.innerWrapper}>
      {_leftIcon}
      {children}
      {_rightIcon}
    </InnerWrapperComponent>
    {subtitle}
    {error}
  </WrapperComponent>
})
