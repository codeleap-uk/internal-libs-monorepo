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
  ButtonPresets,
  ButtonComposition,
  ButtonParts,
} from './styles'
import { forwardRef } from 'react'
import { StylesOf } from '../../types/utility'
import { Text } from '../Text'
import { Touchable, TouchableProps } from '../Touchable'
import { Icon } from '../Icon'
import { View, ViewProps, ViewRefType } from '../View'
import { ActivityIndicator } from '../ActivityIndicator'
import { StyleSheet } from 'react-native'
import { usePressableFeedback } from '../../utils'
export * from './styles'

type ChildProps = {
  styles: StylesOf<ButtonParts>
  props: Omit<ButtonProps, 'children'>
}

type BadgeProps = Omit<Partial<ViewProps>, 'ref'> & {
  text?: string
  children?: React.ReactElement | ((props: Partial<SmartOmit<BadgeProps, 'children'>>) => React.ReactElement)
  styles?: StylesOf<'text'|'wrapper'>
  position?: [number, number]
  textProps?: Partial<PropsOf<typeof Text>>
}

export type ButtonProps = Omit<TouchableProps, 'variants'> &
  ComponentVariants<typeof ButtonPresets> & {
    text?: string
    rightIcon?: IconPlaceholder
    icon?: IconPlaceholder
    styles?: StylesOf<ButtonComposition>
    loading?: boolean
    debounce?: number
    debugName: string
    selected?: boolean
    badge?: ((props:BadgeProps) => JSX.Element) | BadgeProps
    children?: React.ReactNode | ((props: ChildProps) => React.ReactNode)
  }

export const Badge = forwardRef<ViewRefType, BadgeProps>((props, ref) => {
  const {
    children = null,
    styles,
    text,
    textProps = {},
    ...viewProps
  } = props

  return <View
    style={[styles.wrapper]}
    {...viewProps}
    ref={ref}
  >
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
    selected,
    badge = null,
    rightIcon,
    style,
    ...props
  } = buttonProps
  const [pressed, setPressed] = React.useState(false)
  const variantStyles = useDefaultComponentStyle('u:Button', {
    variants,
    transform: StyleSheet.flatten,
    styles,
  })

  function getStyles(key: ButtonParts) {
    return [
      variantStyles[key],
      key === 'wrapper' && style,
      disabled && variantStyles[key + ':disabled'],
      styles[key],
      selected && variantStyles[key + ':selected'],
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

  const disableFeedback = !onPress || props?.noFeedback

  const { getFeedbackStyle } = usePressableFeedback(variantStyles.text, {
    hightlightPropertyIn: 'color',
    hightlightPropertyOut: 'color',
    feedbackConfig: variantStyles?.textFeedback,
    disabled: disableFeedback,
  })

  const { getFeedbackStyle: getFeedbackWrapperStyle } = usePressableFeedback(variantStyles.wrapper, {
    hightlightPropertyIn: 'borderColor',
    hightlightPropertyOut: 'borderColor',
    disabled: disableFeedback,
    feedbackConfig: variantStyles?.wrapperFeedback,
  })

  const childrenContent = TypeGuards.isFunction(children) ?
    // @ts-ignore
    children({ styles: _styles, props: buttonProps })
    : children

  let _badge = null

  if (badge) {
    const badgeStyle = TypeGuards.isFunction(badge) ? {} : badge?.styles || {}

    _badge = React.isValidElement(badge) ? badge : <Badge {...badge} styles={deepMerge({
      text: variantStyles.badgeText,
      wrapper: variantStyles.badgeWrapper,
    }, badgeStyle)}/>

  }

  const rightFeedback = getFeedbackStyle(pressed)

  return (
    <Touchable
      style={[_styles.wrapper, getFeedbackWrapperStyle(pressed)]}
      ref={ref}
      disabled={disabled}
      styles={{
        feedback: variantStyles.feedback,
      }}
      onPress={onPress}
      debugComponent={'Button'}
      noFeedback={!onPress}
      setPressed={setPressed}
      {...props}
    >
      {_badge}
      {loading && <ActivityIndicator style={[_styles.loader, getFeedbackStyle(pressed)]} />}
      {!loading && <Icon name={icon} style={[_styles.leftIcon, getFeedbackStyle(pressed)]} />}
      {text ? <Text text={text} style={[_styles.text, getFeedbackStyle(pressed)]} /> : null}
      {childrenContent}
      <Icon name={rightIcon} style={[_styles.rightIcon, rightFeedback]} />
    </Touchable>
  )
}) as ((props: ButtonProps) => JSX.Element)

