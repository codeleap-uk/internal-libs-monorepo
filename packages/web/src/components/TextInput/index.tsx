import {
  IconPlaceholder,
  TypeGuards,
  useBooleanToggle,
  useValidate,
} from '@codeleap/common'
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import InputMask from 'react-input-mask'
import { Touchable } from '../Touchable'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { getMaskInputProps } from './mask'
import { getTestId } from '../../lib/utils/test'
import { InputRef, TextInputProps } from './types'
import { FileInputRef } from '../FileInput'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'

export * from './types'
export * from './styles'
export * from './mask'

export const TextInput = forwardRef<FileInputRef, TextInputProps>((props, inputRef) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps({
    ...TextInput.defaultProps,
    ...props,
  })

  const {
    style,
    value,
    validate,
    debugName,
    visibilityToggle,
    password,
    onPress,
    multiline,
    caretColor,
    focused,
    _error,
    masking,
    visibleIcon,
    hiddenIcon,
    ...textInputProps
  } = others as TextInputProps

  const innerInputRef = useRef<InputRef>(null)

  const styles = useStylesFor(TextInput.styleRegistryName, style)

  const [_isFocused, setIsFocused] = useState(false)

  const isFocused = _isFocused || focused

  const [secureTextEntry, toggleSecureTextEntry] = useBooleanToggle(true)

  const isMultiline = multiline

  const isMasked = !TypeGuards.isNil(masking)
  const maskProps = isMasked ? getMaskInputProps({ masking }) : null

  const InputElement = isMasked ? InputMask : isMultiline ? TextareaAutosize : 'input'

  // @ts-ignore
  useImperativeHandle(inputRef, () => {
    return {
      focus: () => {
        if (isMasked) {
          // @ts-expect-error
          innerInputRef.current?.getInputDOMNode()?.focus()
        }
        innerInputRef.current?.focus?.()
      },
      isTextInput: true,
      getInputRef: () => {
        return innerInputRef.current
      },
    }
  }, [!!innerInputRef?.current?.focus])

  const isPressable = TypeGuards.isFunction(onPress)

  const validation = useValidate(
    value,
    TypeGuards.isFunction(maskProps?.validator) ? maskProps?.validator : validate,
  )

  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement, Element>) => {
    validation?.onInputBlurred()
    setIsFocused(false)
    props?.onBlur?.(e)
  }, [validation?.onInputBlurred, props?.onBlur])

  const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement, Element>) => {
    validation?.onInputFocused()
    setIsFocused(true)
    props?.onFocus?.(e)
  }, [validation?.onInputFocused, props?.onFocus])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _text = event?.target?.value

    const _value = isMasked && maskProps?.notSaveFormatted
      ? maskProps?.getRawValue(_text)
      : _text

    if (props?.onChange) props?.onChange(event)
    if (props?.onChangeText) props?.onChangeText(_value)
  }

  const isDisabled = !!inputBaseProps.disabled

  const visibilityToggleProps = visibilityToggle ? {
    onPress: toggleSecureTextEntry,
    icon: (secureTextEntry ? hiddenIcon : visibleIcon) as AppIcon,
    debugName: `${debugName} toggle visibility`,
  } : null

  const rightIcon = inputBaseProps?.rightIcon ?? visibilityToggleProps

  const buttonModeProps = isPressable ? {
    editable: false,
    caretHidden: true,
  } : {}
  const rows = textInputProps?.rows ?? (
    isMultiline ? 2 : undefined
  )
  const hasMultipleLines = isMultiline && (String(value)?.includes('\n') || !!rows)

  const hasError = !validation.isValid || _error
  const errorMessage = validation.message || _error

  const placeholderStyles = [
    styles.placeholder,
    isFocused && styles['placeholder:focus'],
    hasError && styles['placeholder:error'],
    isDisabled && styles['placeholder:disabled'],
  ]

  const selectionStyles = [
    styles.selection,
    isFocused && styles['selection:focus'],
    hasError && styles['selection:error'],
    isDisabled && styles['selection:disabled'],
  ]

  const secureTextProps = (password && secureTextEntry) && {
    type: 'password',
  }

  const caretColorStyle = (caretColor || buttonModeProps.caretHidden) && {
    caretColor: buttonModeProps.caretHidden ? 'transparent' : caretColor,
  }

  const inputBaseAction = isPressable ? 'onPress' : 'onClick'

  const testId = getTestId(textInputProps)

  return (
    <InputBase
      innerWrapper={isPressable ? Touchable : undefined}
      {...inputBaseProps}
      debugName={debugName}
      error={hasError ? errorMessage : null}
      style={{
        ...styles,
        innerWrapper: {
          ...styles.innerWrapper,
          ...(isMultiline ? styles['innerWrapper:multiline'] : {}),
          ...(hasMultipleLines ? styles['innerWrapper:hasMultipleLines'] : {}),
        },
      }}
      innerWrapperProps={{
        ...(inputBaseProps.innerWrapperProps || {}),
        [inputBaseAction]: () => {
          if (isMasked) {
            // @ts-expect-error
            innerInputRef.current?.getInputDOMNode()?.focus()
          }
          innerInputRef.current?.focus?.()
          if (isPressable) onPress?.()
        },
        debugName,
      }}
      rightIcon={rightIcon as any}
      focused={isFocused}
    >
      <InputElement
        editable={`${!isPressable && !isDisabled}`}
        {...buttonModeProps}
        {...secureTextProps}
        {...textInputProps}
        value={value}
        onChange={(e) => handleChange(e)}
        // @ts-ignore
        onBlur={handleBlur}
        // @ts-ignore
        onFocus={handleFocus}
        css={[
          styles.input,
          isMultiline && styles['input:multiline'],
          isFocused && styles['input:focus'],
          hasError && styles['input:error'],
          isDisabled && styles['input:disabled'],
          hasMultipleLines && styles['input:hasMultipleLines'],
          {
            '&::placeholder': placeholderStyles,
          },
          {
            '&::selection': selectionStyles,
          },
          {
            '&:focus': [
              { outline: 'none', borderWidth: 0, borderColor: 'transparent' },
              isFocused && styles['input:focus'],
              caretColorStyle,
            ],
          },
        ]}
        {...maskProps}
        ref={innerInputRef}
        data-testid={testId}
      />
    </InputBase>
  )

}) as StyledComponentWithProps<TextInputProps>

TextInput.styleRegistryName = 'TextInput'
TextInput.elements = [...InputBase.elements, 'input', 'placeholder', 'selection']
TextInput.rootElement = 'wrapper'

TextInput.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return TextInput as (props: StyledComponentProps<TextInputProps, typeof styles>) => IJSX
}

TextInput.defaultProps = {
  hiddenIcon: 'input-visiblity:hidden' as AppIcon,
  visibleIcon: 'input-visiblity:visible' as AppIcon,
  masking: null,
} as TextInputProps

WebStyleRegistry.registerComponent(TextInput)
