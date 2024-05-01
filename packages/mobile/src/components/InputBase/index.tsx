import React from 'react'
import { TypeGuards, getRenderedComponent } from '@codeleap/common'
import { ActionIcon, ActionIconProps } from '../ActionIcon'
import { View } from '../View'
import { useInputBaseStyles } from './styles'
import { InputBaseProps } from './types'
import { Text } from '../Text'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from 'src/Registry'

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
    wrapper,
    debugName,
    innerWrapper,
    focused,
    innerWrapperProps = {},
    wrapperProps = {},
    disabled = false,
    order = InputBaseDefaultOrder,
    style,
    labelAsRow = false,
    hideErrorMessage = false,
    ...otherProps
  } = props

  const WrapperComponent = wrapper || View
  const InnerWrapperComponent = innerWrapper || View

  const _styles = useInputBaseStyles(props)

  const _leftIcon = getRenderedComponent<Partial<ActionIconProps>>(leftIcon, ActionIcon, {
    // @ts-ignore
    styles: _styles.leftIconStyles,
    debugName: `${debugName} left icon`,
    dismissKeyboard: false,
  })

  const _rightIcon = getRenderedComponent<Partial<ActionIconProps>>(rightIcon, ActionIcon, {
    // @ts-ignore
    styles: _styles.rightIconStyles,
    debugName: `${debugName} right icon`,
    dismissKeyboard: false,
  })

  const _label = TypeGuards.isString(label) ? <Text text={label} style={_styles.labelStyle} /> : label

  const _error = TypeGuards.isString(error) ? <Text text={error} style={_styles.errorStyle} /> : error

  const _description = TypeGuards.isString(description) ? <Text text={description} style={_styles.descriptionStyle} /> : description

  const parts = {
    label: labelAsRow ? <View style={_styles.labelRowStyle}>
      {_label}
      {_description}
    </View> : _label,
    description: labelAsRow ? null : _description,
    innerWrapper: <InnerWrapperComponent style={[
      _styles.innerWrapperStyle,
    ]} {...innerWrapperProps}>
      {_leftIcon}
      {children}
      {_rightIcon}
    </InnerWrapperComponent>,
    error: hideErrorMessage ? null : (
      _error || <Text text={''} style={_styles.errorStyle} />
    ),
  }

  return <WrapperComponent
    style={[_styles.wrapperStyle, style]}
    {...otherProps}
    {...wrapperProps}
  >
    {
      order.map((key) => <KeyPassthrough key={key}>
        {parts[key]}
      </KeyPassthrough>)

    }
  </WrapperComponent>
}

InputBase.styleRegistryName = 'InputBase'
InputBase.elements = ['wrapper', 'innerWrapper', 'label', 'errorMessage', 'description', 'icon', 'leftIcon', 'rightIcon']
InputBase.rootElement = 'wrapper'

InputBase.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return InputBase as (props: StyledComponentProps<InputBaseProps, typeof styles>) => IJSX
}

MobileStyleRegistry.registerComponent(InputBase)
