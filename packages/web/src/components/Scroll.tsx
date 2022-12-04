/** @jsx jsx */
import {
  ElementType,
  forwardRef,
  ReactElement,
  Ref,
} from 'react'
import { View, ViewProps } from './View'

export const ScrollCP = <T extends ElementType = 'div'>(
  props: ViewProps<T>,
  ref: Ref<any>,
) => {

  return (
    <View
      {...props}
      ref={ref}
      scroll
    />

  )
}

export const Scroll = forwardRef(ScrollCP) as <T extends ElementType = 'div'>(
  props: ViewProps<T>
) => ReactElement
