import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,

  TextInputComposition,
  TextInputStyles,
  useBooleanToggle,
  useDefaultComponentStyle,
  useValidate,
} from '@codeleap/common'
import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import { Text } from './Text'
import { View, ViewProps } from './View'
import { Button } from './Button'
import { Touchable, TouchableProps } from './Touchable'

/** @jsx jsx */
import { jsx } from '@emotion/react'
import { StylesOf } from '../types/utility'
import { Icon } from '.'

type IconProp = { name: IconPlaceholder; action?: () => void }
type MergedRef = React.LegacyRef<HTMLInputElement> &
  React.Ref<HTMLTextAreaElement>

type NativeProps = ComponentPropsWithoutRef<'input'> &
  ComponentPropsWithoutRef<'textarea'>

export type TextInputProps = ComponentVariants<typeof TextInputStyles> &
  Omit<NativeProps, 'value'|'crossOrigin'> & {
    multiline?: boolean
    onChangeText?: (text: string) => void
    disabled?: boolean
    edited?: boolean
    label?: React.ReactNode
    ref?: MergedRef
    leftIcon?: IconProp
    rightIcon?: IconProp
    styles?: StylesOf<TextInputComposition>
    validate?: FormTypes.ValidatorFunctionWithoutForm | string
    value?: string
    password?: boolean
    visibilityToggle?: boolean
    debugName?: string
    touchableWrapper?: boolean
    innerWrapperProps?: TouchableProps<any> | ViewProps<any>
  }

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (rawprops, inputRef) => {
    const {
      onChange,
      value,
      onChangeText,
      disabled,
      edited,
      onFocus,
      onBlur,
      multiline,
      variants,
      label,
      leftIcon,
      rightIcon,
      styles,
      validate,
      password,
      visibilityToggle,
      touchableWrapper,
      innerWrapperProps,
      debugName,
      ...props
    } = rawprops

    const [isFocused, setFocus] = useState(false)
    const [editedState, setEdited] = useState(edited)

    const input = useRef<any>(null)
    const [textIsVisible, setTextVisible] = useBooleanToggle(false)
    const variantStyles = useDefaultComponentStyle('TextInput', {
      variants,
      styles,
    })
    const InputElement = multiline ? TextareaAutosize : 'input'

    const handleBlur: TextInputProps['onBlur'] = (e) => {
      if (!editedState && value) setEdited(true)
      setFocus(false)

      if (onBlur) {
        onBlur(e)
      }
    }

    const handleFocus: TextInputProps['onFocus'] = (e) => {
      setFocus(true)
      if (onFocus) {
        onFocus(e)
      }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value

      if (onChange) onChange(event)
      if (onChangeText) onChangeText(text)
    }

    useImperativeHandle(inputRef, () => ({ ...input.current, focus: () => {
      input.current?.focus?.()
    }, isTextInput: true }))

    const { showError, error } = useValidate(value, validate)
    function getStyles(key: TextInputComposition) {
      const requestedStyles = {
        ...variantStyles[key],
        ...(isFocused ? variantStyles[key + ':focus'] : {}),
        ...(showError ? variantStyles[key + ':error'] : {}),
      }

      return requestedStyles
    }

    const iconStyle = getStyles('icon')
    const leftIconStyle = {
      ...iconStyle,
      ...getStyles('leftIcon'),
    }

    const rightIconStyle = {
      ...iconStyle,
      ...getStyles('rightIcon'),
    }

    const InnerWrapper = touchableWrapper ? Touchable : View

    return (
      <View
        css={getStyles('wrapper')}
      >
        <InputLabel label={label} style={getStyles('label')} />
        <InnerWrapper debugName={debugName} css={getStyles('innerWrapper')} {...innerWrapperProps}>
          <InputIcon {...leftIcon} style={leftIconStyle} />
          <InputElement
            ref={input}
            type={password && !textIsVisible ? 'password' : 'text'}
            onChange={(e) => handleChange(e)}
            value={value}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
            css={[
              getStyles('textField'),
              {
                '&:placeholder': {
                  ...getStyles('placeholder'),
                },
              },
            ]}
          />
          {
            visibilityToggle ?
              <InputIcon name={
                (textIsVisible ? 'input-visiblity:visible' : 'input-visiblity:hidden') as IconPlaceholder
              } action={() => setTextVisible()} style={rightIconStyle} />
              :
              <InputIcon {...rightIcon} style={rightIconStyle} />
          }
        </InnerWrapper>
        <FormError message={error.message} style={{
          ...variantStyles.error,
        }} />
      </View>
    )
  })

export const FormError = ({ message, ...props }) => {
  if (['number', 'string', 'undefined'].includes(typeof message)) {
    return (
      <Text
        text={`${message || ' '}`}
        variants={['p2', 'marginTop:1']}
        {...props}
      />
    )
  }
  return message
}
export const InputIcon: React.FC<{ style: any } & IconProp> = ({
  name,
  style,
  action,
}) => {
  if (!name) return null

  if (action) {
    return (
      <Button
        icon={name}
        onPress={() => action()}
        styles={{ icon: style, wrapper: { height: 'auto' }}}
        variants={['icon']}
      />
    )
  }
  return <Icon name={name} style={style} />
}
export const InputLabel = ({ label, style }) => {
  if (!label) return null

  switch (typeof label) {
    case 'string':
      return <Text css={style} text={label} component={'label'} />
    case 'object':
      return label
    default:
      return null
  }
}
