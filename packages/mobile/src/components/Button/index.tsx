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
import { AnyRecord, GenericStyledComponentAttributes, useNestedStylesByKey, IJSX, mergeStyles, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
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
    badge = false,
    badgeProps = {},
    ...props
  } = {
    ...Button.defaultProps,
    ...buttonProps,
  }

  const [pressed, setPressed] = useState(false)

  const styles = useStylesFor(Button.styleRegistryName, style)

  function getStyles(key: ButtonParts) {
    return mergeStyles([
      styles[key],
      selected && styles[key + ':selected'],
      disabled && styles[key + ':disabled'],
    ])
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
  const isLeftIconHidden = _styles?.leftIcon?.display != 'none'

  const badgeStyles = useNestedStylesByKey('badge', styles)

  return (
    <Touchable
      style={[_styles.wrapper, { feedback: styles.feedback }, getFeedbackWrapperStyle(pressed)]}
      ref={ref}
      disabled={disabled}
      onPress={onPress}
      debugComponent={'Button'}
      noFeedback={!onPress}
      setPressed={setPressed}
      {...props}
    >
      {loading ? <ActivityIndicator style={[_styles.loader, getFeedbackStyle(pressed)]} /> : null}
      {(!loading && isLeftIconHidden) ? <Icon name={icon} style={[_styles.leftIcon, getFeedbackStyle(pressed)]} /> : null}
      {text ? <Text text={text} style={[_styles.text, getFeedbackStyle(pressed)]} /> : null}
      {children}
      <Icon name={rightIcon} style={[_styles.rightIcon, rightFeedback]} />
      <Badge badge={badge} style={badgeStyles} {...badgeProps} />
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
}

MobileStyleRegistry.registerComponent(Button)
