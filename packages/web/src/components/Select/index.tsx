/** @jsx jsx */
import { jsx } from '@emotion/react'

import {
  AnyFunction,
  ComponentVariants,
  IconPlaceholder,
  onUpdate,
  useDefaultComponentStyle,
} from '@codeleap/common'
import _Select, { StylesConfig } from 'react-select'
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
}
>

export const Select: React.FC<SelectProps> = ({ accessible, ...props }) => {

  console.log('RENDERIZOU')

  return (
    <_Select onChange={(e) => console.log({ e })} />

  )
}
