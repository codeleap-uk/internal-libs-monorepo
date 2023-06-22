import * as React from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  IconPlaceholder,
  GetRefType,
  TypeGuards,
  getNestedStylesByKey,
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
import { ActivityIndicator } from '../ActivityIndicator'
import { StyleSheet } from 'react-native'
import { usePressableFeedback } from '../../utils'
import { Badge, BadgeComponentProps } from '../Badge'
export * from './styles'

type ChildProps = {
  styles: StylesOf<ButtonParts>
  props: Omit<ButtonProps, 'children'>
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
    children?: React.ReactNode | ((props: ChildProps) => React.ReactNode)
  } & BadgeComponentProps

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
    rightIcon,
    style,
    badge = false,
    badgeProps = {},
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

  const rightFeedback = getFeedbackStyle(pressed)

  // TODO - This is a hack to hide the icon when there is no text
  const isLeftIconHidden = _styles?.leftIcon?.display != 'none'

  const badgeStyles = getNestedStylesByKey('badge', variantStyles)

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
      {loading && <ActivityIndicator style={[_styles.loader, getFeedbackStyle(pressed)]} />}
      {(!loading && isLeftIconHidden) && <Icon name={icon} style={[_styles.leftIcon, getFeedbackStyle(pressed)]} />}
      {text ? <Text text={text} style={[_styles.text, getFeedbackStyle(pressed)]} /> : null}
      {childrenContent}
      <Icon name={rightIcon} style={[_styles.rightIcon, rightFeedback]} />
      <Badge badge={badge} style={badgeStyles} {...badgeProps} />
    </Touchable>
  )
}) as ((props: ButtonProps) => JSX.Element)

