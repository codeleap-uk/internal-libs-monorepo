import React, { forwardRef } from 'react'
import { TypeGuards } from '@codeleap/types'
import { getRenderedComponent } from '@codeleap/utils'
import { ActionIcon, ActionIconProps } from '../ActionIcon'
import { View } from '../View'
import { useInputBaseStyles } from './styles'
import { InputBaseProps } from './types'
import { Text } from '../Text'
import RNAnimated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { View as RNView } from 'react-native'
import { StyledComponentWithProps } from '@codeleap/styles'

export { useInputBase } from './useInputBase'

export * from './styles'
export * from './utils'
export * from './types'

export const InputBaseDefaultOrder: InputBaseProps['order'] = [
  'label',
  'description',
  'innerWrapper',
  'error',
]

export const InputBase = forwardRef<RNView, InputBaseProps>((props: InputBaseProps, ref) => {
  const {
    children,
    error = null,
    label,
    description = null,
    leftIcon = null,
    rightIcon = null,
    wrapper,
    debugName,
    innerWrapper,
    focused,
    innerWrapperProps = {},
    wrapperProps = {},
    disabled,
    order = InputBaseDefaultOrder,
    style,
    labelAsRow,
    hideErrorMessage,
    ...otherProps
  } = {
    ...InputBase.defaultProps,
    ...props,
  }

  const styles = useInputBaseStyles(props)

  const _leftIcon = getRenderedComponent<Partial<ActionIconProps>>(leftIcon, ActionIcon, {
    // @ts-ignore
    style: styles.leftIconStyles,
    debugName: `${debugName} left icon`,
    dismissKeyboard: false,
  })

  const _rightIcon = getRenderedComponent<Partial<ActionIconProps>>(rightIcon, ActionIcon, {
    // @ts-ignore
    style: styles.rightIconStyles,
    debugName: `${debugName} right icon`,
    dismissKeyboard: false,
  })

  const WrapperComponent = wrapper ?? View

  const InnerWrapperComponent = innerWrapper ?? View

  return <WrapperComponent
    {...otherProps}
    {...wrapperProps}
    style={styles.wrapperStyle}
    ref={ref}
  >
    {TypeGuards.isString(label) ? <Text text={label} style={styles.labelStyle} /> : label}

    {TypeGuards.isString(description) ? <Text text={description} style={styles.descriptionStyle} /> : description}

    <InnerWrapperComponent style={styles.innerWrapperStyle} {...innerWrapperProps}>
      {_leftIcon}
      {children}
      {_rightIcon}
    </InnerWrapperComponent>

    {hideErrorMessage || !error ? null : (
      <RNAnimated.View exiting={FadeOut.duration(100)} entering={FadeIn.duration(200)}>
        {TypeGuards.isString(error) ? <Text text={error} style={styles.errorStyle} /> : error}
      </RNAnimated.View>
    )}
  </WrapperComponent>
}) as StyledComponentWithProps<InputBaseProps>

InputBase.elements = ['wrapper', 'innerWrapper', 'label', 'errorMessage', 'description', 'icon', 'leftIcon', 'rightIcon']

InputBase.defaultProps = {
  disabled: false,
  labelAsRow: false,
  hideErrorMessage: false,
  order: InputBaseDefaultOrder,
  wrapper: View,
  innerWrapper: View,
} as Partial<InputBaseProps>
