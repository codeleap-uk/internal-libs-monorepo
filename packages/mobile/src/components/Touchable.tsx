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
import { TouchableOpacity as NativeTouchable, Pressable, View } from 'react-native'

import { createAnimatableComponent } from 'react-native-animatable'
export type TouchableProps = Omit<
  ComponentPropsWithoutRef<typeof Pressable>,
  'onPress'
> & {
  variants?: ComponentVariants<typeof ViewStyles>['variants']
  component?: any
  ref?: React.Ref<View>
  debugName: string
  activeOpacity?: number
  debugComponent?: string
  feedbackVariant?: 'opacity' | 'none' | 'highlight'
  onPress?: AnyFunction
} & BaseViewProps

export const Touchable: React.FC<TouchableProps> = forwardRef<
  View,
  TouchableProps
>((touchableProps, ref) => {
  const {
    variants = [],
    children,
    onPress,
    style,
    activeOpacity = 0.5,
    debugName,
    debugComponent,
    feedbackVariant = 'opacity',
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
      debugName || variants,
      'User interaction',
    )
    onPress && onPress()
  }

  const styles = [variantStyles.wrapper, style]

  function getFeedbackStyle(pressed:boolean, variant: TouchableProps['feedbackVariant']) {
    switch (variant) {
      case 'highlight':
        return {
          backgroundColor: pressed ? '#e0e0e0' : 'transparent',
        }
        break
      case 'opacity':
        return {
          opacity: pressed ? activeOpacity : 1,
        }
      case 'none':
        return {}
    }
  }

  return (
    <Pressable onPress={press} style={({ pressed }) => ([
      getFeedbackStyle(pressed, feedbackVariant),
      styles,
    ])} {...props} ref={ref}>
      {children}
    </Pressable>
  )
})

export const AnimatedTouchable = createAnimatableComponent(Touchable) as unknown as typeof Touchable
