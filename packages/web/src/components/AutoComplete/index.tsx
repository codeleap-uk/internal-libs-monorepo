/** @jsx jsx */
import { jsx } from '@emotion/react'

import {
  AnyFunction,
} from '@codeleap/common'
import _Select, { StylesConfig } from 'react-select'
import { ReactNode, useEffect, useId, useLayoutEffect, useRef } from 'react'

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
}
>

export const AutoComplete: React.FC<AutoCompleteProps> = ({ accessible, ...props }) => {

  console.log('RENDERIZOU')

  return (
    <_Select onChange={(e) => console.log({ e })} maxMenuHeight={300}
      menuPlacement='auto' />

  )
}
