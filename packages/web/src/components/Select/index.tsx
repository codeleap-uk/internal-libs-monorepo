/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Fragment } from 'react'
import { AnyFunction, useDefaultComponentStyle, useValidate } from '@codeleap/common'
import _Select, { StylesConfig, SelectComponentsConfig, Props } from 'react-select'
import Async, { useAsync, AsyncProps } from 'react-select/async'
import { ReactNode } from 'react'
import { View } from '../View'
import { Text } from '../Text'

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
} & Props
>

export const ReactSelect = (props: Props) => {
  return (
    <_Select {...props} />
  )
}

export const AsyncReactSelect = (props) => {
  return (
    <Async {...props}/>
  )
}

export const Select: React.FC<SelectProps> = ({ accessible, variants, validate, styles, label, onValueChange, searchable, ...props }) => {

  const { showError, error } = useValidate(props.value, validate)

  const variantStyles = useDefaultComponentStyle(
    'Select',
    {
      variants,
      styles,
    },
  )
  const reactSelectStyles: StylesConfig = {
    container: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.wrapper,
      ...props.css,
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.innerWrapper,
      width: 500,
      borderRadius: 8,
      minHeight: 50,
    }),
    menuPortal: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.listPortal,
      overflow: 'visible',
      zIndex: 99999,
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.listWrapper,
      overflow: 'visible',
      zIndex: 99999,
    }),
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.list,
      overflow: 'visible',
      zIndex: 99999,
      borderRadius: 8,
    }),
    group: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',
    }),
    indicatorSeparator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.separatorIcon,
      display: 'none',
    }),
    groupHeading: (baseStyles, state) => ({
      ...baseStyles,
    }),
    clearIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.clearIcon,
    }),
    dropdownIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.dropdownIcon,
    }),
    indicatorsContainer: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.iconsWrapper,
    }),
    input: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.input,
    }),
    loadingIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.loadingIcon,
    }),
    loadingMessage: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.loadingText,
    }),
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValue,
    }),
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValueLabel,
    }),
    multiValueRemove: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValueRemove,
    }),
    noOptionsMessage: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.noItemsText,
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.item,
    }),
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.placeholder,
    }),
    singleValue: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputValue,
    }),
    valueContainer: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputValueWrapper,
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
