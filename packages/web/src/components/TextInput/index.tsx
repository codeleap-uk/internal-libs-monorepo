import { TypeGuards } from '@codeleap/types'
import React, { useImperativeHandle } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import { IMaskInput } from 'react-imask'
import { Touchable } from '../Touchable'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { getTestId } from '../../lib/utils/test'
import { TextInputProps } from './types'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { useTextInput } from './useTextInput'
import { useInputBasePartialStyles } from '../InputBase/useInputBasePartialStyles'

export * from './types'
export * from './styles'
export * from './mask'

export const TextInput = (props: TextInputProps) => {
  const allProps = {
    ...TextInput.defaultProps,
    ...props,
  }

  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps(allProps)

  const {
    style,
    debugName,
    visibilityToggle,
    password,
    onPress,
    caretColor,
    visibleIcon,
    hiddenIcon,
    focused,
    ref: inputRef,
    ...textInputProps
  } = others as TextInputProps

  const styles = useStylesFor(TextInput.styleRegistryName, style)

  const {
    isMultiline,
    isMasked,
    isFocused: isInputFocused,
    secureTextEntry,
    handleBlur,
    handleFocus,
    handleChange,
    handleAccept,
    maskProps,
    innerInputRef,
    wrapperRef,
    errorMessage,
    toggleSecureTextEntry,
    hasMultipleLines,
    hasError,
    inputValue,
  } = useTextInput(allProps)

  const isFocused = isInputFocused || focused

  const isDisabled = !!inputBaseProps.disabled

  const partialStyles = useInputBasePartialStyles(styles, ['placeholder', 'selection'], {
    disabled: isDisabled,
    error: !!hasError,
    focus: isFocused,
  })

  const InputElement: any = isMasked ? IMaskInput : isMultiline ? TextareaAutosize : 'input'

  const isPressable = TypeGuards.isFunction(onPress)

  const focus = () => {
    innerInputRef.current?.focus?.()
  }

  useImperativeHandle(inputRef, () => {
    return {
      focus: () => focus(),
      isTextInput: true,
      getInputRef: () => {
        return innerInputRef.current as unknown as HTMLInputElement
      },
    }
  }, [!!innerInputRef?.current?.focus])

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
      ref={wrapperRef}
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
          focus()
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
        onBlur={handleBlur as any}
        onFocus={handleFocus as any}
        css={[
          styles.input,
          isMultiline && styles['input:multiline'],
          isFocused && styles['input:focus'],
          hasError && styles['input:error'],
          isDisabled && styles['input:disabled'],
          hasMultipleLines && styles['input:hasMultipleLines'],
          {
            '&::placeholder': partialStyles?.placeholder,
          },
          {
            '&::selection': partialStyles?.selection,
          },
          {
            '&:focus': [
              { outline: 'none', borderWidth: 0, borderColor: 'transparent' },
              isFocused && styles['input:focus'],
              caretColorStyle,
            ],
          },
        ] as any}
        {...(isMasked ? {
          ...maskProps,
          onAccept: handleAccept,
          inputRef: innerInputRef,
          unmask: maskProps?.notSaveFormatted ? true : false,
          type: maskProps?.obfuscated ? 'password' : textInputProps.type,
        } : {
          onChange: handleChange,
          ref: innerInputRef,
        })}
        value={inputValue}
        data-testid={testId}
      />
    </InputBase>
  )

}

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
