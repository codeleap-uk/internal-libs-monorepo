import { TypeGuards } from '@codeleap/types'
import React, { forwardRef, useImperativeHandle } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import InputMask from 'react-input-mask'
import { Touchable } from '../Touchable'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { getTestId } from '../../lib/utils/test'
import { InputRef, TextInputProps } from './types'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { useTextInput } from './useTextInput'
import { useInputBasePartialStyles } from '../InputBase/useInputBasePartialStyles'

export * from './types'
export * from './styles'
export * from './mask'

export const TextInput = forwardRef<InputRef, TextInputProps>((props, inputRef) => {
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
    ...textInputProps
  } = others as TextInputProps

  const styles = useStylesFor(TextInput.styleRegistryName, style)

  const {
    isMultiline,
    isMasked,
    isFocused,
    secureTextEntry,
    handleBlur,
    handleFocus,
    handleChange,
    maskProps,
    innerInputRef,
    wrapperRef,
    errorMessage,
    toggleSecureTextEntry,
    hasMultipleLines,
    hasError,
    inputValue,
  } = useTextInput(allProps)

  const isDisabled = !!inputBaseProps.disabled

  const partialStyles = useInputBasePartialStyles(styles, ['placeholder', 'selection'], {
    disabled: isDisabled,
    error: !!hasError,
    focus: isFocused,
  })

  const InputElement = isMasked ? InputMask : isMultiline ? TextareaAutosize : 'input'

  const isPressable = TypeGuards.isFunction(onPress)

  const focus = () => {
    if (isMasked) {
      // @ts-expect-error
      innerInputRef.current?.getInputDOMNode()?.focus()
    }

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
        ]}
        {...maskProps}
        value={inputValue}
        onChange={handleChange}
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
