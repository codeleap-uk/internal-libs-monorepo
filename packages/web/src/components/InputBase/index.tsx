/** @jsx jsx */
import { jsx } from '@emotion/react'
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

export const InputBaseDefaultOrder:InputBaseProps['order'] = [
  'label',
  'description',
  'innerWrapper',
  'error',
]
const KeyPassthrough = (props: React.PropsWithChildren<any>) => {
  return <React.Fragment>{props.children}</React.Fragment>
}

export const InputBase = React.forwardRef<unknown, InputBaseProps>((props, ref) => {
  const {
    children,
    error = null,
    label,
    description = null,
    leftIcon = null,
    rightIcon = null,
    styles,
    wrapper,
    debugName,
    innerWrapper,
    focused,
    innerWrapperProps = {},
    wrapperProps = {},
    disabled = false,
    order = InputBaseDefaultOrder,
    style,
    noError = false,
    labelAsRow = false,
    innerWrapperRef,
    ...otherProps
  } = props

  const WrapperComponent = wrapper || View
  const InnerWrapperComponent = innerWrapper || View

  const _styles = useInputBaseStyles(props)

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

  const _label = TypeGuards.isString(label) ? <Text text={label} css={_styles.labelStyle}/> : label

  const _error = TypeGuards.isString(error) ? <Text text={error} css={_styles.errorStyle}/> : error

  const _description = TypeGuards.isString(description) ? <Text text={description} css={_styles.descriptionStyle}/> : description

  const parts = {
    label: labelAsRow ? <View css={_styles.labelRowStyle}>
      {_label}
      {_description}
    </View> : _label,
    description: labelAsRow ? null : _description,
    innerWrapper: <InnerWrapperComponent ref={innerWrapperRef} css={[
      _styles.innerWrapperStyle,
    ]} {...innerWrapperProps}>
      {_leftIcon}
      {children}
      {_rightIcon}
    </InnerWrapperComponent>,
    error: noError ? null : (
      _error || <Text children={<React.Fragment>
        &nbsp;
      </React.Fragment>} css={_styles.errorStyle}/>
    ),
  }

  return (
    <WrapperComponent
      css={[_styles.wrapperStyle, style]}
      {...otherProps}
      {...wrapperProps}
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
})
