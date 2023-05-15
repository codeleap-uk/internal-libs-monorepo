/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Fragment } from 'react'
import {
  AnyFunction,
  ComponentVariants,
  IconPlaceholder,
  onUpdate,
  useDefaultComponentStyle,
  useValidate,
} from '@codeleap/common'
import _Select, { StylesConfig, SelectComponentsConfig, Props } from 'react-select'
import { ReactNode, useEffect, useId, useLayoutEffect, useRef } from 'react'
// import _Select, { StylesConfig } from 'react-select'

import { v4 } from 'uuid'

import { StylesOf } from '../../types/utility'
import { Button } from '../Button'
import { View } from '../View'
import { Text } from '../Text'
import { Overlay } from '../Overlay'

export * from './styles'

export type AutoCompleteProps = React.PropsWithChildren<{
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

const ReactSelect = (props: Props) => {
  return (
    <_Select {...props} />
  )
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({ accessible, variants, validate, styles, label, ...props }) => {

  const { showError, error } = useValidate(props.value, validate)

  const variantStyles = useDefaultComponentStyle(
    'Select', // This should correspond to the key of the component passed to the variants prop of StyleProvider
    {
      variants, // The variants prop is an array containing the variant names
      styles, // This allows you to override the styles of each part of the composition through props
    },
  )

  const reactSelectStyles: StylesConfig = {
    container: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.wrapper,
      ...props.css,
      height: 800,
      // overflow: 'visible',

    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.innerWrapper,
      width: 500,
      // overflow: 'visible',

    }),
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      // ...variantStyles.list,
      // backgroundColor: 'red',
      // height: 800,
      overflow: 'visible',
      zIndex: 99999,

    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      // backgroundColor: 'red',
      // height: 400,
      overflow: 'visible',
      zIndex: 99999,
      top: 35,
    }),

    group: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',
      backgroundColor: 'red',
      // height: 400,
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',

    }),
    menuPortal: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',

    }),
    indicatorSeparator: (baseStyles, state) => ({
      ...baseStyles,
      display: 'none',
    }),

  }

  return (
    <View variants={['column']}>
      {label && <Text text={label} variants={['p2', 'marginTop:1', 'marginBottom:2']} />}
      <ReactSelect
        styles={reactSelectStyles}
        onChange={(e) => props.onValueChange(e?.value)}
        isMulti
        {...props}
      />
      {showError && <Text text={error?.message} variants={['p2', 'marginTop:1']} />}
    </View>
  )
}
