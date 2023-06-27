/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  ElementType,
  forwardRef,
  ReactElement,
  Ref,
} from 'react'
import { NativeHTMLElement } from '../../types'
import { View, ViewProps } from '../View'

export const ScrollCP = <T extends NativeHTMLElement = 'div'>(
  props: ViewProps<T>,
  ref: Ref<any>,
) => {

  return (
    // @ts-ignore
    <View
      {...props}
      ref={ref}
      scroll
    />

  )
}

export * from './styles'

export const Scroll = forwardRef(ScrollCP) as <T extends NativeHTMLElement = 'div'>(
  props: ViewProps<T>
) => JSX.Element
