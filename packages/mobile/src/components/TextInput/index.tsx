import * as React from 'react'
import {
  ComponentVariants,
  FormTypes,
  PropsOf,
  TypeGuards,
  useDefaultComponentStyle,
  useValidate,
  yup,
  useState,
  useBooleanToggle,
  IconPlaceholder,
} from '@codeleap/common'
import { forwardRef, useImperativeHandle } from 'react'
import { ComponentWithDefaultProps, StylesOf } from '../../types'
import { StyleSheet, TextInput as NativeTextInput, TextInputProps as NativeTextInputProps, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import { InputBase, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { TextInputComposition, TextInputPresets } from './styles'
import { Touchable } from '../Touchable'
import { MaskedTextInput, TextInputMaskProps } from '../../modules/textInputMask'

export * from './styles'

export type TextInputProps =
  Omit<InputBaseProps, 'styles' | 'variants'> &
  NativeTextInputProps &
  {
    styles?: StylesOf<TextInputComposition>
    password?: boolean
    validate?: FormTypes.ValidatorFunctionWithoutForm | yup.SchemaOf<string>
    debugName: string
    visibilityToggle?: boolean
    masking?: FormTypes.TextField['masking']
    variants?: ComponentVariants<typeof TextInputPresets>['variants']
    onChangeMask?: TextInputMaskProps['onChangeText']
    visibleIcon?: IconPlaceholder
    hiddenIcon?: IconPlaceholder
    _error?: string
  } & Pick<PropsOf<typeof Touchable>, 'onPress'>

const defaultProps:Partial<TextInputProps> = {
  hiddenIcon: 'input-visiblity:hidden' as IconPlaceholder,
  visibleIcon: 'input-visiblity:visible' as IconPlaceholder,
}

export const TextInput = forwardRef<NativeTextInput, TextInputProps>((props, inputRef) => {

  const innerInputRef = React.useRef<NativeTextInput>(null)

  const [isFocused, setIsFocused] = useState(false)

  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps({
    ...TextInput.defaultProps,
    ...props,
  })

  const {
    variants,
    styles,
    value,
    validate,
    debugName,
    visibilityToggle = false,
    masking,
    password,
    onChangeMask,
    onPress,
    visibleIcon,
    hiddenIcon,
    _error = null,
    ...textInputProps
  } = others

  const [secureTextEntry, toggleSecureTextEntry] = useBooleanToggle(true)

  const isMasked = !!masking

  const InputElement = isMasked ? MaskedTextInput : NativeTextInput

  const variantStyles = useDefaultComponentStyle<'u:TextInput', typeof TextInputPresets>('u:TextInput', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  // @ts-expect-error - React's ref type system is weird
  useImperativeHandle(inputRef, () => {
    return {
      ...innerInputRef.current,
      focus: () => {
        innerInputRef.current?.focus?.()
      },
      isTextInput: true,
    }
  }, [!!innerInputRef?.current?.focus])

  const isPressable = TypeGuards.isFunction(onPress)

  const validation = useValidate(value, validate)

  const handleBlur = React.useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    validation.onInputBlurred()
    setIsFocused(false)
    props.onBlur?.(e)
  }, [validation.onInputBlurred, props.onBlur])

  const handleFocus = React.useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    validation.onInputFocused()
    setIsFocused(true)
    props.onFocus?.(e)
  }, [validation.onInputFocused, props.onFocus])

  const handleMaskChange = (masked, unmasked) => {

    if (textInputProps.onChangeText) textInputProps.onChangeText(masking?.saveFormatted ? masked : masked)
    if (onChangeMask) onChangeMask(masked, unmasked)
  }

  const isMultiline = textInputProps.multiline
  const isDisabled = !!inputBaseProps.disabled

  const placeholderTextColor = [
    [isDisabled, variantStyles['placeholder:disabled']],
    [!validation.isValid, variantStyles['placeholder:error']],
    [isFocused, variantStyles['placeholder:focus']],
    [true, variantStyles.placeholder],
  ].find(([x]) => x)?.[1]?.color

  const selectionColor = [
    [isDisabled, variantStyles['selection:disabled']],
    [!validation.isValid, variantStyles['selection:error']],
    [isFocused, variantStyles['selection:focus']],
    [true, variantStyles.selection],
  ].find(([x]) => x)?.[1]?.color

  const visibilityToggleProps = visibilityToggle ? {
    onPress: toggleSecureTextEntry,
    icon: (secureTextEntry ? hiddenIcon : visibleIcon) as IconPlaceholder,
    debugName: `${debugName} toggle visibility`,
  } : null

  const rightIcon = inputBaseProps?.rightIcon ?? visibilityToggleProps

  const maskingExtraProps = isMasked ? {
    onChangeText: handleMaskChange,
    ref: null,

    refInput: (inputRef) => {
      // console.log(inputRef)
      if (!!inputRef) {
        innerInputRef.current = inputRef

      }
    },
    ...masking,
  } : {}

  const buttonModeProps = isPressable ? {
    // pointerEvents: 'none',
    editable: false,
    caretHidden: true,
  } : {}

  const hasMultipleLines = isMultiline && value?.includes('\n')
  return <InputBase
    {...inputBaseProps}
    innerWrapper={isPressable ? Touchable : undefined}
    debugName={debugName}
    error={(validation.isValid && !_error) ? null : _error || validation.message}
    styles={{
      ...variantStyles,
      innerWrapper: [
        variantStyles.innerWrapper,
        isMultiline && variantStyles['innerWrapper:multiline'],
        hasMultipleLines && variantStyles['innerWrapper:hasMultipleLines'],
      ],
    }}
    innerWrapperProps={{
      ...(inputBaseProps.innerWrapperProps || {}),
      onPress,
      debugName,
    }}
    rightIcon={rightIcon}
    focused={isFocused}
  >
    <InputElement

      allowFontScaling={false}
      editable={!isPressable && !isDisabled}
      {...buttonModeProps}
      placeholderTextColor={placeholderTextColor}
      value={value}
      selectionColor={selectionColor}
      secureTextEntry={password && secureTextEntry}
      {...textInputProps}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={[
        variantStyles.input,
        isMultiline && variantStyles['input:multiline'],
        isFocused && variantStyles['input:focused'],
        !validation.isValid && variantStyles['input:error'],
        isDisabled && variantStyles['input:disabled'],
        hasMultipleLines && variantStyles['input:hasMultipleLines'],
      ]}
      ref={innerInputRef}
      pointerEvents={isPressable ? 'none' : undefined}
      textAlignVertical={isMultiline ? 'top' : undefined}
      {...maskingExtraProps}
    />
  </InputBase>
})

export type SearchInputProps = {
  onTypingChange: (isTyping: boolean) => void
  onSearchChange: (search: string) => void
  onClear?: () => void
  debugName: string
  debounce?: number
  clearIcon?: IconPlaceholder
  searchIcon?: IconPlaceholder
  placeholder: string
} & Partial<TextInputProps>

export const SearchInput: ComponentWithDefaultProps<SearchInputProps> = (props) => {
  const {
    debugName,
    onClear,
    onSearchChange,
    onTypingChange,
    clearIcon,
    searchIcon,
    debounce,
    placeholder,
  } = {
    ...SearchInput.defaultProps,
    ...props,
  }

  const [search, setSearch] = useState('')

  const setSearchTimeout = React.useRef<NodeJS.Timeout|null>(null)

  const handleChangeSearch = (value: string) => {
    setSearch(value)

    if (TypeGuards.isNil(debounce)) {
      onSearchChange?.(value)
    } else {
      if (setSearchTimeout.current) {
        clearTimeout(setSearchTimeout.current)
      }

      setSearchTimeout.current = setTimeout(() => {
        onSearchChange(value)
      }, debounce ?? 0)
    }

  }

  const handleClear = () => {
    setSearch('')
    onSearchChange?.('')
    onClear?.()
  }

  return (
    <TextInput
      value={search}
      onChangeText={(value) => {
        onTypingChange?.(true)
        handleChangeSearch(value)
      }}
      onEndEditing={() => {
        onTypingChange?.(false)
        // setLoading(false)
      }}
      placeholder={placeholder}
      debugName={`Search ${debugName}`}
      rightIcon={!!search.trim() && {
        name: clearIcon,
        onPress: handleClear,
      }}
      leftIcon={{
        name: searchIcon,
      }}
    />
  )
}

TextInput.defaultProps = defaultProps
SearchInput.defaultProps = {
  debounce: null,
  clearIcon: 'x' as IconPlaceholder,
  searchIcon: 'search' as IconPlaceholder,
}
