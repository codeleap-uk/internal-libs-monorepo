import * as React from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,

  IconPlaceholder,
  GetRefType,
  SmartOmit,
  TypeGuards,
  deepMerge,
  PropsOf,
} from '@codeleap/common'

import {
  ButtonStyles,
  ButtonComposition,
  ButtonParts,
} from './styles'
import { forwardRef } from 'react'
import { StylesOf } from '../../types/utility'
import { Text } from '../Text'
import { Touchable, TouchableProps } from '../Touchable'
import { Icon } from '../Icon'
import { View, ViewProps } from '../View'
import { ActivityIndicator } from '../ActivityIndicator'
import { StyleSheet } from 'react-native'
export * from './styles'

type ChildProps = {
  styles: StylesOf<ButtonParts>
  pressed: boolean
  props: Omit<ButtonProps, 'children'>
}

type BadgeProps = Partial<ViewProps> & {
  text?: string
  children?: React.ReactElement | ((props: Partial<SmartOmit<BadgeProps, 'children'>>) => React.ReactElement)
  styles?: StylesOf<'text'|'wrapper'>
  position?: [number, number]
  textProps?: Partial<PropsOf<typeof Text>>
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
    badge?: React.ReactElement | BadgeProps
    children?: React.ReactNode | ((props: ChildProps) => React.ReactNode)
  }

export const Badge = forwardRef<GetRefType<ViewProps['ref']>, BadgeProps>((props, ref) => {
  const {
    children = null,
    styles,
    text,
    textProps = {},
    ...viewProps
  } = props

  return <View style={[styles.wrapper]} {...viewProps} ref={ref}>
    {text && <Text text={text} style={styles.text} {...textProps}/>}
    {(TypeGuards.isFunction(children) ? children({ ...viewProps, styles, text }) : children)}
  </View>
})

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
    badge = null,
    rightIcon,
    debounce = 600,
    style,
    ...props
  } = buttonProps
  const [pressed, setPressed] = React.useState(false)

  const variantStyles = useDefaultComponentStyle('u:Button', {
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

  let _badge = null

  if (badge) {
    _badge = React.isValidElement(badge) ? badge : <Badge {...badge} styles={deepMerge({
      text: variantStyles.badgeText,
      wrapper: variantStyles.badgeWrapper,
    }, badge?.styles || {})}/>

  }

  return (
    <Touchable
      style={_styles.wrapper}
      onPress={handlePress}
      ref={ref}
      disabled={disabled}
      styles={{
        feedback: variantStyles.feedback,
      }}
      debugComponent={'Button'}
      noFeedback={!onPress}
      {...props}
    >
      {_badge}
      {loading && <ActivityIndicator style={_styles.loader} />}
      {!loading && <Icon name={icon} style={_styles.leftIcon} renderEmptySpace={hasText && !!rightIcon}/>}
      {text ? <Text text={text} style={_styles.text} /> : null}
      {childrenContent}
      <Icon name={rightIcon} style={_styles.rightIcon} renderEmptySpace={(hasText && !!icon) || loading} />
    </Touchable>
  )
})
