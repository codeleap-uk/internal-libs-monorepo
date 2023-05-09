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
} & Props
>

const ReactSelect = (props: Props) => {
  return (
    <_Select {...props} />
  )
}

export const Select: React.FC<SelectProps> = ({ accessible, ...props }) => {

  const { showError, error } = useValidate(props.value, props?.validate)

  return (
    <Fragment>
      <ReactSelect onChange={(e) => props.onValueChange(e?.value)} {...props} />
      {showError && <Text text={error?.message} variants={['p2', 'marginTop:1']} css={styles.errorText} />}
    </Fragment>
  )
}
