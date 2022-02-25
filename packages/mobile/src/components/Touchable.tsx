import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  BaseViewProps,
  ViewStyles,
  useCodeleapContext,
  AnyFunction,
} from '@codeleap/common'
import { View } from './View'
import { TouchableOpacity as NativeTouchable } from 'react-native'

import { createAnimatableComponent } from 'react-native-animatable'
export type TouchableProps = Omit<
  ComponentPropsWithoutRef<typeof NativeTouchable>,
  'onPress'
> & {
  variants?: ComponentVariants<typeof ViewStyles>['variants']
  component?: any
  ref?: React.Ref<NativeTouchable>
  debugName: string
  debugComponent?: string
  onPress?: AnyFunction
} & BaseViewProps

export const Touchable: React.FC<TouchableProps> = forwardRef<
  NativeTouchable,
  TouchableProps
>((touchableProps, ref) => {
  const {
    variants = [],
    children,
    onPress,
    style,
    debugName,
    debugComponent,
    ...props
  } = touchableProps

  const variantStyles = useDefaultComponentStyle('View', {
    variants,
  })

  const { logger } = useCodeleapContext()
  const press = () => {
    if (!onPress) { throw { message: 'No onPress passed to touchable', touchableProps } }
    logger.log(
      `<${debugComponent || 'Touchable'}/>  pressed`,
      { debugName, style, variants },
      'User interaction',
    )
    onPress && onPress()
  }

  const styles = [variantStyles.wrapper, style]

  return (
    <NativeTouchable onPress={press} style={styles} {...props} ref={ref}>
      {children}
    </NativeTouchable>
  )
})

export const AnimatedTouchable = createAnimatableComponent(Touchable)
