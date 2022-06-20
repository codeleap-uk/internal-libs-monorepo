import * as React from 'react'
import {
  useDefaultComponentStyle,
  ButtonStyles,
  ComponentVariants,
  ButtonComposition,
  ButtonParts,
  IconPlaceholder,
  GetRefType,
} from '@codeleap/common'
import { forwardRef } from 'react'
import { StylesOf } from '../types/utility'
import { Text } from './Text'
import { Touchable, TouchableProps } from './Touchable'
import { Icon } from './Icon'
import { ActivityIndicator } from './ActivityIndicator'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

type ChildProps = {
  styles: StylesOf<ButtonParts>
  pressed: boolean
  props: Omit<ButtonProps, 'children'>
}

export type ButtonProps = Omit<TouchableProps, 'variants'> &
  ComponentVariants<typeof ButtonStyles> & {
    text?: string
    rightIcon?: IconPlaceholder
    icon?: IconPlaceholder
    styles?: StylesOf<ButtonComposition>
    loading?: boolean
    debounce?: number
    debugName: string
    children?: React.ReactNode | ((props: ChildProps) => React.ReactNode)
  }

export const Button = forwardRef<GetRefType<TouchableProps['ref']>, ButtonProps>((buttonProps, ref) => {
  const {
    variants = [],
    children,
    icon,
    text,
    loading,
    styles = {},
    onPress,
    disabled,
    rightIcon,
    debounce = 600,
    style,
    ...props
  } = buttonProps
  const [pressed, setPressed] = React.useState(false)

  const variantStyles = useDefaultComponentStyle('Button', {
    variants,
    transform: StyleSheet.flatten,
    styles,
  })

  function handlePress() {
    if (!pressed) {
      setPressed(true)

      setTimeout(() => setPressed(false), debounce)

      onPress && onPress()
    }
  }

  function getStyles(key: ButtonParts) {
    return [
      variantStyles[key],
      key === 'wrapper' && style,
      disabled && variantStyles[key + ':disabled'],
      styles[key],
      disabled && styles[key + ':disabled'],
    ]
  }

  const iconStyle = getStyles('icon')

  const leftIconStyle = StyleSheet.flatten([iconStyle, getStyles('leftIcon')])
  const rightIconStyle = StyleSheet.flatten([iconStyle, getStyles('rightIcon')])

  const hasText = !!(text || children)

  const _styles = {
    wrapper: getStyles('wrapper'),
    loader: getStyles('loader'),
    leftIcon: leftIconStyle,
    rightIcon: rightIconStyle,
    text: getStyles('text'),
    icon: getStyles('icon'),

  }

  const childrenContent = typeof children === 'function' ?
    children({ styles: _styles, props: buttonProps, pressed })
    : children

  return (
    <Touchable
      style={_styles.wrapper}
      onPress={handlePress}
      ref={ref}
      disabled={disabled}
      debugComponent={'Button'}
      {...props}
    >

      {loading && <ActivityIndicator style={_styles.loader} />}
      {!loading && <Icon name={icon} style={_styles.leftIcon} renderEmptySpace={hasText}/>}
      {text ? <Text text={text} style={_styles.text} /> : null}
      {childrenContent}
      <Icon name={rightIcon} style={_styles.rightIcon} renderEmptySpace={hasText} />
    </Touchable>
  )
})
