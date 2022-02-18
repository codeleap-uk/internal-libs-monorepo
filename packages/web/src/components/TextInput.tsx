import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
  onUpdate,
  TextInputComposition,
  TextInputStyles,
  useBooleanToggle,
  useDefaultComponentStyle,
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
import { View } from './View'
import { Button } from './Button'

/** @jsx jsx */
import { jsx } from '@emotion/react'
import { StylesOf } from '../types/utility'
import { Icon } from '.'

type IconProp = { name: IconPlaceholder; action?: () => void };
type MergedRef = React.LegacyRef<HTMLInputElement> &
  React.Ref<HTMLTextAreaElement>;

type NativeProps = ComponentPropsWithoutRef<'input'> &
  ComponentPropsWithoutRef<'textarea'>;

export type TextInputProps = ComponentVariants<typeof TextInputStyles> &
  Omit<NativeProps, 'value'> & {
    multiline?: boolean;
    onChangeText?: (text: string) => void;
    disabled?: boolean;
    edited?: boolean;
    type?: string;
    label?: React.ReactNode;
    ref?: MergedRef;
    leftIcon?: IconProp;
    rightIcon?: IconProp;
    styles?: StylesOf<TextInputComposition>;
    validate?: FormTypes.ValidatorFunctionWithoutForm | string;
    value?: string;
    password?: boolean;
    visibilityToggle?: boolean;
  };

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (rawprops, inputRef) => {
    const {
      onChange,
      type,
      value,
      onChangeText,
      disabled,
      edited,
      onFocus,
      onBlur,
      multiline,
      responsiveVariants,
      variants,
      label,
      leftIcon,
      rightIcon,
      styles,
      validate,
      password,
      visibilityToggle,
      ...props
    } = rawprops

    const [focused, setFocus] = useState(false)
    const [editedState, setEdited] = useState(edited)
    const [error, setError] = useState<ReturnType<FormTypes.ValidatorFunction>>(
      {
        valid: true,
        message: '',
      },
    )
    const input = useRef<any>(null)
    const [textIsVisible, setTextVisible] = useBooleanToggle(false)
    const variantStyles = useDefaultComponentStyle('TextInput', {
      variants,
      responsiveVariants,
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

    const handleChange = (event) => {
      const text = event.target.value
      if (onChange) onChange(event)
      if (onChangeText) onChangeText(text)
    }

    onUpdate(() => {
      const result =
        typeof validate === 'function'
          ? validate(input?.current?.value)
          : { message: validate, valid: false }
      setError(result)
    }, [value, validate])

    useImperativeHandle(inputRef, () => input.current)

    const showError = !error.valid && error.message
    const inputType = type || password ? 'password' : 'text'

    const inputVisibilityType = textIsVisible ? 'text' : 'password'

    const leftIconStyle = {
      ...variantStyles.icon,
      ...(showError ? variantStyles['icon:error'] : {}),
      ...(focused ? variantStyles['icon:focus'] : {}),
      ...variantStyles.leftIcon,
      ...(showError ? variantStyles['leftIcon:error'] : {}),
      ...(focused ? variantStyles['leftIcon:focus'] : {}),
    }

    const rightIconStyle = {
      ...variantStyles.icon,
      ...(focused ? variantStyles['icon:focus'] : {}),
      ...(showError ? variantStyles['icon:error'] : {}),
      ...variantStyles.rightIcon,
      ...(showError ? variantStyles['rightIcon:error'] : {}),
      ...(focused ? variantStyles['rightIcon:focus'] : {}),
    }

    return (
      <View
        css={[
          variantStyles.wrapper,
          focused && variantStyles['wrapper:focus'],
          showError && variantStyles['wrapper:error'],
        ]}
      >
        <InputLabel label={label} style={variantStyles.label} />

        <View
          css={[
            variantStyles.innerWrapper,
            focused && variantStyles['innerWrapper:focus'],
            showError && variantStyles['innerWrapper:error'],
          ]}
        >
          <InputIcon {...leftIcon} style={leftIconStyle} />
          <InputElement
            ref={input}
            type={visibilityToggle ? inputVisibilityType : inputType}
            onChange={handleChange}
            value={value}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            rows={4}
            {...props}
            css={[
              variantStyles.textField,
              focused && variantStyles['textField:focus'],
              showError && variantStyles['textField:error'],
            ]}
          />
          {visibilityToggle ? (
            <InputIcon
              name={
                (textIsVisible
                  ? 'input-visiblity:visible'
                  : 'input-visiblity:hidden') as IconPlaceholder
              }
              action={() => setTextVisible()}
              style={rightIconStyle}
            />
          ) : (
            <InputIcon {...rightIcon} style={rightIconStyle} />
          )}
        </View>

        <FormError
          message={error.message}
          css={{
            ...variantStyles.error,
          }}
        />
      </View>
    )
  },
)

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
        styles={{
          icon: style,
        }}
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
