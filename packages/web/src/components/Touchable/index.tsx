/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'
import { AnyFunction, useCodeleapContext } from '@codeleap/common'

import React, { ComponentPropsWithRef, ElementType, forwardRef, ReactElement } from 'react'
import { stopPropagation } from '../../lib'
import { View } from '../View'
import { TouchableComposition } from './styles'
import { StylesOf } from '../../types'

export * from './styles'

export type TouchableProps<T extends ElementType = 'button'> = ComponentPropsWithRef<T> & {
  css?: CSSObject
  component?: T
  disabled?: boolean
  propagate?: boolean
  onPress?: AnyFunction
  debugComponent?: string
  debugName?: string
  styles?: StylesOf<TouchableComposition>
}

export const TouchableCP = <T extends ElementType = typeof View>(
  touchableProps: TouchableProps<T>,
  ref,
) => {
  const {
    children,
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
    onClick?.(event)
    onPress && onPress()
    // logger.log('Touchable pressed', JSON.stringify(touchableProps, null, 2)  ,'Component')
  }

  return (
    <View component={Component || 'div'} {...props} onClick={handleClick} ref={ref}>
      {children}
    </View>
  )
}

export const Touchable = forwardRef(TouchableCP) as <T extends ElementType = typeof View>(
  touchableProps: TouchableProps<T>
) => ReactElement
