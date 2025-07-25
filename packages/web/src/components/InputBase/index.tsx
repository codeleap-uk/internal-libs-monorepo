import React, { forwardRef } from 'react'
import { TypeGuards } from '@codeleap/types'
import { getRenderedComponent } from '@codeleap/utils'
import { ActionIcon, ActionIconProps } from '../ActionIcon'
import { View } from '../View'
import { useInputBaseStyles } from './styles'
import { InputBaseProps } from './types'
import { Text } from '../Text'
import { StyledComponentWithProps } from '@codeleap/styles'

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
  return <React.Fragment>{props.children}</React.Fragment>
}

export const InputBase = forwardRef((props: InputBaseProps, ref) => {
  const allProps = {
    ...InputBase.defaultProps,
    ...props,
  }

  const {
    children,
    error,
    label,
    description,
    leftIcon,
    rightIcon,
    wrapper: WrapperComponent,
    debugName,
    innerWrapper: InnerWrapperComponent,
    focused,
    innerWrapperProps,
    wrapperProps,
    disabled,
    order,
    style,
    noError,
    labelAsRow,
    innerWrapperRef,
    ...otherProps
  } = allProps

  const styles = useInputBaseStyles(allProps)

  const _leftIcon = getRenderedComponent<Partial<ActionIconProps>>(leftIcon, ActionIcon, {
    style: styles.leftIconStyles,
    disabled,
    debugName: `${debugName} left icon`,
  })

  const _rightIcon = getRenderedComponent<Partial<ActionIconProps>>(rightIcon, ActionIcon, {
    style: styles.rightIconStyles,
    disabled,
    debugName: `${debugName} right icon`,
  })

  const _label = TypeGuards.isString(label) ? <Text text={label} style={styles.labelStyle} /> : label

  const _error = TypeGuards.isString(error) ? <Text text={error} style={styles.errorStyle} /> : error

  const _description = TypeGuards.isString(description) ? <Text text={description} style={styles.descriptionStyle} /> : description

  const parts = {
    label: labelAsRow ? (
      <View style={styles.labelRowStyle}>
        {_label}
        {_description}
      </View>
    ) : (
      _label
    ),
    description: labelAsRow ? null : _description,
    innerWrapper:
      <InnerWrapperComponent
        ref={innerWrapperRef}
        style={styles.innerWrapperStyle}
        {...innerWrapperProps}
      >
        {_leftIcon}
        {children}
        {_rightIcon}
      </InnerWrapperComponent>,
    error: noError ? null : (_error || <Text children={<React.Fragment> &nbsp; </React.Fragment>} style={styles.errorStyle} />),
  }

  return (
    <WrapperComponent
      {...otherProps}
      {...wrapperProps}
      style={styles.wrapperStyle}
      ref={ref}
    >
      {
        order.map((key) => (
          <KeyPassthrough key={key}>
            {parts[key]}
          </KeyPassthrough>
        ))
      }
    </WrapperComponent>
  )
}) as StyledComponentWithProps<InputBaseProps>

InputBase.elements = [
  'wrapper',
  'innerWrapper',
  'label',
  'errorMessage',
  'description',
  'labelRow',
  'icon',
  'leftIcon',
  'rightIcon',
]

InputBase.defaultProps = {
  noError: false,
  labelAsRow: false,
  disabled: false,
  order: InputBaseDefaultOrder,
  rightIcon: null,
  leftIcon: null,
  description: null,
  error: null,
  wrapper: View,
  innerWrapper: View,
} as Partial<InputBaseProps>
