/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Fragment } from 'react'
import { AnyFunction, useDefaultComponentStyle, useValidate } from '@codeleap/common'
import _Select, { StylesConfig, SelectComponentsConfig, Props } from 'react-select'
import { ReactNode } from 'react'
import { View } from '../View'
import { Text } from '../Text'

export * from './styles'

export type MultiSelectProps = React.PropsWithChildren<{
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

export const MultiSelect: React.FC<MultiSelectProps> = ({ accessible, variants, validate, styles, label, onValueChange, ...props }) => {

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
  }

  return (
    <View variants={['column']}>
      {label && <Text css={variantStyles.label} text={label} variants={['p2', 'marginTop:1', 'marginBottom:2']} />}
      <ReactSelect
        styles={reactSelectStyles}
        onChange={onValueChange}
        isMulti
        {...props}
      />
      {showError && <Text css={variantStyles.erroText} text={error?.message} variants={['p2', 'marginTop:1']} />}
    </View>
  )
}
