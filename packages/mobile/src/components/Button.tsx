import * as React from 'react'
import {
  useDefaultComponentStyle,
  ButtonStyles,
  ComponentVariants,
  ButtonComposition,
  ButtonParts,
  IconPlaceholder,
} from '@codeleap/common'
import { forwardRef } from 'react'
import { StylesOf } from '../types/utility'
import { Text } from './Text'
import { Touchable, TouchableProps } from './Touchable'
import { Icon } from './Icon'
import { ActivityIndicator } from './ActivityIndicator'
import { StyleSheet, TouchableOpacity } from 'react-native'

export type ButtonProps = Omit<TouchableProps, 'variants'> &
  ComponentVariants<typeof ButtonStyles> & {
    text?: string
    rightIcon?: IconPlaceholder
    icon?: IconPlaceholder
    styles?: StylesOf<ButtonComposition>
    loading?: boolean
    debounce?: number
    debugName?: string // NOTE this should not be optional
  };

export const Button = forwardRef<TouchableOpacity, ButtonProps>((buttonProps, ref) => {
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
    debugName,
    debounce = 600,
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
      disabled && variantStyles[key + ':disabled'],
      styles[key],
      disabled && styles[key + ':disabled'],
    ]
  }

  const iconStyle = getStyles('icon')

  const leftIconStyle = StyleSheet.flatten([iconStyle, getStyles('leftIcon')])
  const rightIconStyle = StyleSheet.flatten([iconStyle, getStyles('rightIcon')])

  const hasText = !!(text || children)
  return (
    <Touchable
      style={getStyles('wrapper')}
      onPress={handlePress}
      ref={ref}
      disabled={disabled}
      debugComponent={'Button'}
      {...props}
      debugName={debugName || text || icon || 'Some button'}
    >

      {loading && <ActivityIndicator style={getStyles('loader')} />}
      {!loading && <Icon name={icon} style={leftIconStyle} renderEmptySpace={hasText}/>}
      {text ? <Text text={text} style={getStyles('text')} /> : null}
      {children}
      <Icon name={rightIcon} style={rightIconStyle} renderEmptySpace={hasText} />
    </Touchable>
  )
})
