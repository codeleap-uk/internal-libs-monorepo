import React from 'react'
import { TypeGuards, getRenderedComponent } from '@codeleap/common'
import { ActionIcon, ActionIconProps } from '../ActionIcon'
import { View } from '../View'
import { useInputBaseStyles } from './styles'
import { InputBaseProps } from './types'
import { Text } from '../Text'

export * from './styles'
export * from './utils'
export * from './types'

export const InputBaseDefaultOrder: InputBaseProps['order'] = [
  'label',
  'description',
  'innerWrapper',
  'error',
]

const KeyPassthrough = (props: React.PropsWithChildren<any>) => {
  return <>{props.children}</>
}

export const InputBase = (props: InputBaseProps) => {
  const {
    children,
    error = null,
    label,
    description = null,
    leftIcon = null,
    rightIcon = null,
    wrapper: WrapperComponent,
    debugName,
    innerWrapper: InnerWrapperComponent,
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

  const _label = TypeGuards.isString(label) ? <Text text={label} style={styles.labelStyle} /> : label

  const _error = TypeGuards.isString(error) ? <Text text={error} style={styles.errorStyle} /> : error

  const _description = TypeGuards.isString(description) ? <Text text={description} style={styles.descriptionStyle} /> : description

  const parts = {
    label: labelAsRow ? <View style={styles.labelRowStyle}>
      {_label}
      {_description}
    </View> : _label,
    description: labelAsRow ? null : _description,
    innerWrapper: <InnerWrapperComponent style={[
      styles.innerWrapperStyle,
    ]} {...innerWrapperProps}>
      {_leftIcon}
      {children}
      {_rightIcon}
    </InnerWrapperComponent>,
    error: hideErrorMessage ? null : (
      _error || <Text text={''} style={styles.errorStyle} />
    ),
  }

  return <WrapperComponent
    {...otherProps}
    {...wrapperProps}
    style={styles.wrapperStyle}
  >
    {
      order.map((key) => <KeyPassthrough key={key}>
        {parts[key]}
      </KeyPassthrough>)

    }
  </WrapperComponent>
}

InputBase.elements = ['wrapper', 'innerWrapper', 'label', 'errorMessage', 'description', 'icon', 'leftIcon', 'rightIcon']

InputBase.defaultProps = {
  disabled: false,
  labelAsRow: false,
  hideErrorMessage: false,
  order: InputBaseDefaultOrder,
  wrapper: View,
  innerWrapper: View,
} as Partial<InputBaseProps>
