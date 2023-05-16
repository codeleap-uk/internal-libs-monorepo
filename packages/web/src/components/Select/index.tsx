/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Fragment } from 'react'
import { AnyFunction, useDefaultComponentStyle, useValidate } from '@codeleap/common'
import _Select, { StylesConfig, SelectComponentsConfig, Props } from 'react-select'
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
  onValueChange?: () => void
  label?: string
} & Props
>

export const ReactSelect = (props: Props) => {
  return (
    <_Select {...props} />
  )
}

export const Select: React.FC<SelectProps> = ({ accessible, variants, validate, styles, label, onValueChange, ...props }) => {

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
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.list,
      overflow: 'visible',
      zIndex: 99999,
      borderRadius: 8,
    }),
    menuPortal: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',
      zIndex: 99999,
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',
      zIndex: 99999,
    }),
    group: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',
    }),
    indicatorSeparator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.separator,
      display: 'none',
    }),
    groupHeading: (baseStyles, state) => ({
      ...baseStyles,
    }),
    clearIndicator: (baseStyles, state) => ({
      ...baseStyles,
    }),
    dropdownIndicator: (baseStyles, state) => ({
      ...baseStyles,
    }),
    indicatorsContainer: (baseStyles, state) => ({
      ...baseStyles,
    }),
    input: (baseStyles, state) => ({
      ...baseStyles,
    }),
    loadingIndicator: (baseStyles, state) => ({
      ...baseStyles,
    }),
    loadingMessage: (baseStyles, state) => ({
      ...baseStyles,
    }),
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
    }),
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
    }),
    multiValueRemove: (baseStyles, state) => ({
      ...baseStyles,
    }),
    noOptionsMessage: (baseStyles, state) => ({
      ...baseStyles,
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
    }),
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
    }),
    singleValue: (baseStyles, state) => ({
      ...baseStyles,
    }),
    valueContainer: (baseStyles, state) => ({
      ...baseStyles,
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
      <ReactSelect
        styles={reactSelectStyles}
        value={selectedOption}
        onChange={(e) => onValueChange(e)}
        {...props}
      />
      {showError && <Text css={variantStyles.errorText} text={error?.message} variants={['p2', 'marginTop:1']} />}
    </View>
  )
}
