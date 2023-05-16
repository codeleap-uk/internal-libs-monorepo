/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Fragment } from 'react'
import { AnyFunction, FormTypes, useDefaultComponentStyle, useValidate } from '@codeleap/common'
import _Select, { StylesConfig, Props, GroupBase } from 'react-select'
import Async, { AsyncProps } from 'react-select/async'
import { ReactNode } from 'react'
import { View } from '../View'
import { Text } from '../Text'
import { SelectPresets } from './styles'

export * from './styles'

export type SelectProps = React.PropsWithChildren<{
  visible: boolean
  title?: React.ReactNode
  toggle: AnyFunction
  accessible?: boolean
  showClose?: boolean
  closable?: boolean
  scroll?: boolean
  footer?: ReactNode
  debugName?: string
  searchable?: boolean
  onValueChange?: () => void
  label?: string
} & Props<OptionType, false, GroupBase<OptionType>>
>

export const ReactSelect = (props: Props) => {
  return (
    <_Select {...props} />
  )
}

type OptionType = FormTypes.Options<string>[number]

export const AsyncReactSelect = (props: AsyncProps<OptionType, false, GroupBase<OptionType>>) => {
  return (
    <Async {...props}/>
  )
}

export const Select: React.FC<SelectProps> = ({ accessible, variants, validate, styles, label, onValueChange, searchable, ...props }) => {

  const { showError, error } = useValidate(props.value, validate)

  const variantStyles = useDefaultComponentStyle<'u:Select', typeof SelectPresets>(
    'u:Select',
    {
      variants,
      styles,
    },
  )
  const reactSelectStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
    container: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.wrapper,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
      ...props.css,
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.innerWrapper,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),

    }),
    menuPortal: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.listPortal,
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.listWrapper,
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.list,
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    group: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    indicatorSeparator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.separatorIcon,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    groupHeading: (baseStyles, state) => ({
      ...baseStyles,
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    clearIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.clearIcon,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    dropdownIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.dropdownIcon,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    indicatorsContainer: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.iconsWrapper,
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    input: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.input,
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    loadingIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.loadingIcon,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    loadingMessage: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.loadingText,
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValue,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValueLabel,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    multiValueRemove: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValueRemove,
    }),
    noOptionsMessage: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.noItems,
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.item,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.placeholder,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    singleValue: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputValue,
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
    valueContainer: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputValueWrapper,
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),
    }),
  }

  const selectedOption = props?.options?.find?.(o => {
    if (typeof props.value === 'object') {
      return o.value === props.value
    }
    return o.value === props.value
  })

  return (
    <View variants={['column']}>
      {label && <Text css={variantStyles.label} text={label} variants={['p2', 'marginTop:1', 'marginBottom:2']} />}
      {searchable ? (
        <AsyncReactSelect
          styles={reactSelectStyles}
          value={selectedOption}
          onChange={(e) => onValueChange(e)}
          {...props}
        />
      ) : (

        <ReactSelect
          styles={reactSelectStyles}
          value={selectedOption}
          onChange={(e) => onValueChange(e)}
          {...props}

        />
      )}
      {showError && <Text css={variantStyles.errorText} text={error?.message} variants={['p2', 'marginTop:1']} />}
    </View>
  )
}
