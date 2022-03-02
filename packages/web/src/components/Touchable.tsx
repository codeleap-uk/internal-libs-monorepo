/** @jsx jsx */
import { AnyFunction, useCodeleapContext } from '@codeleap/common'
import { jsx, CSSObject } from '@emotion/react'

import React, { ComponentPropsWithRef, ElementType } from 'react'
import { stopPropagation } from '../lib/utils/stopPropagation'
import { View } from './View'

export type TouchableProps<T extends ElementType> = ComponentPropsWithRef<T> & {
  css?: CSSObject
  component?: T
  disabled?: boolean
  propagate?: boolean
  onPress?: AnyFunction
  debugComponent?: string
  debugName?: string
}

export const Touchable = <T extends ElementType = typeof View>(
  touchableProps: TouchableProps<T>,
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

    if (!onPress) { throw { message: 'No onPress passed to touchable', touchableProps } }
    logger.log(
      `<${debugComponent || 'Touchable'}/>  pressed`,
      { debugName, debugComponent },
      'User interaction',
    )
    onPress && onPress()
    onClick?.()
    // logger.log('Touchable pressed', JSON.stringify(touchableProps, null, 2)  ,'Component')
  }

  return (
    <Component {...props} onClick={handleClick}>
      {children}
    </Component>
  )
}
