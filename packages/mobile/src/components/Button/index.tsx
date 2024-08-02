import React, { forwardRef, useState } from 'react'
import { GetRefType } from '@codeleap/common'
import { ButtonParts } from './styles'
import { Text } from '../Text'
import { Touchable, TouchableProps } from '../Touchable'
import { Icon } from '../Icon'
import { ActivityIndicator } from '../ActivityIndicator'
import { StyleSheet } from 'react-native'
import { TouchableFeedbackConfig, usePressableFeedback } from '../../utils'
import { Badge } from '../Badge'
import { ButtonProps } from './types'
import { AnyRecord, useNestedStylesByKey, IJSX, mergeStyles, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const Button = forwardRef<GetRefType<TouchableProps['ref']>, ButtonProps>((buttonProps, ref) => {
  const {
    children,
    icon,
    text,
    loading,
    onPress,
    disabled,
    selected,
    rightIcon,
    style,
    badge,
    badgeProps = {},
    ...props
  } = {
    ...Button.defaultProps,
    ...buttonProps,
  }

  const [pressed, setPressed] = useState(false)

  const styles = useStylesFor(Button.styleRegistryName, style)

  const getStyles = (key: ButtonParts) => mergeStyles([
    styles[key],
    selected && styles[key + ':selected'],
    disabled && styles[key + ':disabled'],
  ])

  const iconStyle = getStyles('icon')

  const leftIconStyle = StyleSheet.flatten([iconStyle, getStyles('leftIcon')])
  const rightIconStyle = StyleSheet.flatten([iconStyle, getStyles('rightIcon')])

  const componentStyles = {
    wrapper: getStyles('wrapper'),
    loader: getStyles('loader'),
    leftIcon: leftIconStyle,
    rightIcon: rightIconStyle,
    text: getStyles('text'),
    icon: getStyles('icon'),
  }

  const disableFeedback = !onPress || props?.noFeedback

  const { getFeedbackStyle } = usePressableFeedback(styles.text, {
    hightlightPropertyIn: 'color',
    hightlightPropertyOut: 'color',
    feedbackConfig: styles?.textFeedback as TouchableFeedbackConfig,
    disabled: disableFeedback,
  })

  const { getFeedbackStyle: getFeedbackWrapperStyle } = usePressableFeedback(styles.wrapper, {
    hightlightPropertyIn: 'borderColor',
    hightlightPropertyOut: 'borderColor',
    disabled: disableFeedback,
    feedbackConfig: styles?.wrapperFeedback as TouchableFeedbackConfig,
  })

  const rightFeedback = getFeedbackStyle(pressed)

  // @ts-expect-error This is a hack to hide the icon when there is no text
  const isLeftIconHidden = componentStyles?.leftIcon?.display != 'none'

  const badgeStyles = useNestedStylesByKey('badge', styles)

  return (
    <Touchable
      ref={ref}
      disabled={disabled}
      onPress={onPress}
      debugComponent={'Button'}
      noFeedback={!onPress}
      setPressed={setPressed}
      {...props}
      style={[componentStyles.wrapper, { feedback: styles.feedback }, getFeedbackWrapperStyle(pressed)]}
    >
      {loading ? <ActivityIndicator style={[componentStyles.loader, getFeedbackStyle(pressed)]} /> : null}
      {(!loading && isLeftIconHidden) ? <Icon name={icon} style={[componentStyles.leftIcon, getFeedbackStyle(pressed)]} /> : null}
      {text ? <Text text={text} style={[componentStyles.text, getFeedbackStyle(pressed)]} /> : null}
      {children}
      {rightIcon ? <Icon name={rightIcon} style={[componentStyles.rightIcon, rightFeedback]} /> : null}
      <Badge badge={badge} {...badgeProps} style={badgeStyles} />
    </Touchable>
  )
}) as StyledComponentWithProps<ButtonProps>

Button.styleRegistryName = 'Button'
Button.elements = ['wrapper', 'text', 'icon', 'leftIcon', 'rightIcon', 'loader', 'badge']
Button.rootElement = 'wrapper'

Button.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Button as (props: StyledComponentProps<ButtonProps, typeof styles>) => IJSX
}

Button.defaultProps = {
  hitSlop: 10,
  badge: false
} as Partial<ButtonProps>

MobileStyleRegistry.registerComponent(Button)
