/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react'
import { AnyFunction, useCodeleapContext } from '@codeleap/common'
import React, { forwardRef } from 'react'
import { stopPropagation } from '../../lib'
import { View } from '../View'
import { TouchableComposition } from './styles'
import { StylesOf, NativeHTMLElement, HTMLProps } from '../../types'

export * from './styles'

export type TouchableProps<T extends NativeHTMLElement = 'button'> = Omit<HTMLProps<T>, 'style'> & {
  component?: T
  disabled?: boolean
  propagate?: boolean
  style?: CSSObject
  onPress?: AnyFunction
  debugComponent?: string
  debugName?: string
  styles?: StylesOf<TouchableComposition>
}

export const TouchableCP = <T extends NativeHTMLElement = 'button'>(
  touchableProps: TouchableProps<T>,
  ref,
) => {
  const {

    propagate = true,
    component: Component = View,
    disabled,
    onPress,
    onClick,
    debugComponent,
    debugName,
    ...props
  } = touchableProps

  const { logger } = useCodeleapContext()

  const handleClick = (event: React.MouseEvent<T>) => {
    if (disabled) return

    if (!propagate) stopPropagation(event)

    if (!onPress && !onClick) {
      logger.warn('No onPress passed to touchable', touchableProps)
      return
    }

    logger.log(
      `<${debugComponent || 'Touchable'}/>  pressed`,
      { debugName, debugComponent },
      'User interaction',
    )
    // @ts-ignore
    onClick?.(event)
    onPress && onPress()

  }

  return (
    // @ts-ignore
    <View component={Component || 'button'} {...props} debugName={debugName} onClick={handleClick} ref={ref}/>
  )
}

export const Touchable = forwardRef(TouchableCP) as <T extends NativeHTMLElement = 'button'>(
  touchableProps: TouchableProps<T>
) => JSX.Element
