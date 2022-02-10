import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useComponentStyle,
  BaseViewProps,
  ViewStyles,
  useStyle,
  AnyFunction,
} from '@codeleap/common'
import { View } from './View'
import { TouchableOpacity as NativeTouchable } from 'react-native'

import { createAnimatableComponent } from 'react-native-animatable'
export type TouchableProps = Omit<
  ComponentPropsWithoutRef<typeof NativeTouchable>,
  'onPress'
> & {
  variants?: ComponentVariants<typeof ViewStyles>['variants'];
  component?: any;
  ref?: React.Ref<NativeTouchable>;
  debugName?: string;
  onPress?: AnyFunction;
} & BaseViewProps;

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

    ...props
  } = touchableProps

  const variantStyles = useComponentStyle('View', {
    variants,
  })

  const { logger } = useStyle()
  const press = () => {
    if (!onPress) { throw { message: 'No onPress passed to touchable', touchableProps } }
    logger.log(
      `${debugName || '<Touchable/>'}  pressed`,
      { style, variants },
      'Component',
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
