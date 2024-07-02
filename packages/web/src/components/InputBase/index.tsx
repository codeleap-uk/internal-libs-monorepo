/** @jsx jsx */
import React from 'react'
import { TypeGuards, getRenderedComponent } from '@codeleap/common'
import { ActionIcon, ActionIconProps } from '../ActionIcon'
import { View } from '../View'
import { useInputBaseStyles } from './styles'
import { InputBaseProps } from './types'
import { Text } from '../Text'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'

export * from './styles'
export * from './utils'
export * from './types'

export const InputBaseDefaultOrder:InputBaseProps['order'] = [
  'label',
  'description',
  'innerWrapper',
  'error',
]

const KeyPassthrough = (props: React.PropsWithChildren<any>) => {
  return <React.Fragment>{props.children}</React.Fragment>
}

export const InputBase = (props: InputBaseProps) => {
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
    wrapper,
    debugName,
    innerWrapper,
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

  const WrapperComponent = wrapper || View
  const InnerWrapperComponent = innerWrapper || View

  const _styles = useInputBaseStyles({ ...allProps, styleRegistryName: InputBase.styleRegistryName })

  const _leftIcon = getRenderedComponent<Partial<ActionIconProps>>(leftIcon, ActionIcon, {
    // @ts-ignore
    styles: _styles.leftIconStyles,
    disabled,
    debugName: `${debugName} left icon`,
  })

  const _rightIcon = getRenderedComponent<Partial<ActionIconProps>>(rightIcon, ActionIcon, {
    // @ts-ignore
    styles: _styles.rightIconStyles,
    disabled,
    debugName: `${debugName} right icon`,
  })

  const _label = TypeGuards.isString(label) ? <Text text={label} style={_styles.labelStyle}/> : label

  const _error = TypeGuards.isString(error) ? <Text text={error} style={_styles.errorStyle}/> : error

  const _description = TypeGuards.isString(description) ? <Text text={description} style={_styles.descriptionStyle}/> : description

  const parts = {
    label: labelAsRow ? (
      <View style={_styles.labelRowStyle}>
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
        style={_styles.innerWrapperStyle}
        {...innerWrapperProps}
      >
        {_leftIcon}
        {children}
        {_rightIcon}
      </InnerWrapperComponent>,
    error: noError ? null : (_error || <Text children={<React.Fragment> &nbsp; </React.Fragment>} style={_styles.errorStyle}/>),
  }

  return (
    <WrapperComponent
      {...otherProps}
      {...wrapperProps}
      style={_styles.wrapperStyle}
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
}

InputBase.styleRegistryName = 'InputBase'

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

InputBase.rootElement = 'wrapper'

InputBase.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return InputBase as (props: StyledComponentProps<InputBaseProps, typeof styles>) => IJSX
}

InputBase.defaultProps = {
  noError: false,
  labelAsRow: false,
  disabled: false,
  order: InputBaseDefaultOrder,
  rightIcon: null,
  leftIcon: null,
  description: null,
  error: null,
} as Partial<InputBaseProps>

WebStyleRegistry.registerComponent(InputBase)
