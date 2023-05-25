/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react'
import { Fragment } from 'react'
import { AnyFunction, FormTypes, useDefaultComponentStyle, useValidate, yup } from '@codeleap/common'
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
  variants: string[]
  validate: FormTypes.ValidatorWithoutForm<string> | yup.SchemaOf<string>
  css?: CSSObject
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
      ...(state.isFocused ? variantStyles['wrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['wrapper:disabled'] : {}),
      ...(showError ? variantStyles['wrapper:error'] : {}),
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
      ...(showError ? variantStyles['listPortal:error'] : {}),
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.listWrapper,
      ...(showError ? variantStyles['listWrapper:error'] : {}),
    }),
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.list,
      ...(showError ? variantStyles['list:error'] : {}),
    }),
    group: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',
      ...(showError ? variantStyles['group:error'] : {}),
    }),
    indicatorSeparator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.separatorIcon,
      ...(state.isFocused ? variantStyles['separatorIcon:focused'] : {}),
      ...(state.isDisabled ? variantStyles['separatorIcon:disabled'] : {}),
      ...(showError ? variantStyles['separatorIcon:error'] : {}),
    }),
    groupHeading: (baseStyles, state) => ({
      ...baseStyles,
      ...(showError ? variantStyles['groupHeading:error'] : {}),
    }),
    clearIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.clearIcon,
      ...(state.isFocused ? variantStyles['clearIcon:focused'] : {}),
      ...(showError ? variantStyles['clearIcon:error'] : {}),
    }),
    dropdownIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.dropdownIcon,
      ...(state.isFocused ? variantStyles['dropdownIcon:focused'] : {}),
      ...(state.isDisabled ? variantStyles['dropdownIcon:disabled'] : {}),
      ...(showError ? variantStyles['dropdownIcon:error'] : {}),
    }),
    indicatorsContainer: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.iconsWrapper,
      ...(state.isDisabled ? variantStyles['iconsWrapper:disabled'] : {}),
      ...(showError ? variantStyles['iconsWrapper:error'] : {}),
    }),
    input: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.input,
      ...(state.isDisabled ? variantStyles['input:disabled'] : {}),
      ...(showError ? variantStyles['input:error'] : {}),
    }),
    loadingIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.loadingIcon,
      ...(state.isFocused ? variantStyles['loadingIndicator:focused'] : {}),
      ...(state.isDisabled ? variantStyles['loadingIndicator:disabled'] : {}),
      ...(showError ? variantStyles['loadingIndicator:error'] : {}),
    }),
    loadingMessage: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.loadingText,
      ...(showError ? variantStyles['loadingText:error'] : {}),
    }),
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValue,
      ...(state.isFocused ? variantStyles['inputMultiValue:focused'] : {}),
      ...(state.isDisabled ? variantStyles['inputMultiValue:disabled'] : {}),
      ...(showError ? variantStyles['inputMultiValue:error'] : {}),
    }),
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValueLabel,
      ...(state.isFocused ? variantStyles['inputMultiValueLabel:focused'] : {}),
      ...(state.isDisabled ? variantStyles['inputMultiValueLabel:disabled'] : {}),
      ...(showError ? variantStyles['inputMultiValueLabel:error'] : {}),
    }),
    multiValueRemove: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValueRemove,
    }),
    noOptionsMessage: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.noItems,
      ...(showError ? variantStyles['noItems:error'] : {}),
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.item,
      ...(state.isFocused ? variantStyles['item:focused'] : {}),
      ...(state.isDisabled ? variantStyles['item:disabled'] : {}),
      ...(showError ? variantStyles['item:error'] : {}),
    }),
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.placeholder,
      ...(state.isFocused ? variantStyles['placeholder:focused'] : {}),
      ...(state.isDisabled ? variantStyles['placeholder:disabled'] : {}),
      ...(showError ? variantStyles['placeholder:error'] : {}),
    }),
    singleValue: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputValue,
      ...(state.isDisabled ? variantStyles['inputValue:disabled'] : {}),
      ...(showError ? variantStyles['inputValue:error'] : {}),
    }),
    valueContainer: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputValueWrapper,
      ...(state.isDisabled ? variantStyles['inputValueWrapper:disabled'] : {}),
      ...(showError ? variantStyles['inputValueWrapper:error'] : {}),
    }),
  }

  const selectedOption = props?.options?.find?.(o => {
    if (typeof props.value === 'object') {
      return o.value === props.value
    }
    return o.value === props.value
  })

  return (
    <View css={variantStyles.selectWrapper} variants={['column']}>
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
