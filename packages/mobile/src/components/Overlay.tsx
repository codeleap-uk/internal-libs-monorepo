import * as React from 'react'
import {
  ComponentVariants,
  IconPlaceholder,
  onUpdate,
  OverlayComposition,
  OverlayStyles,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { ReactNode } from 'react'
import { InputLabel } from './TextInput'
import { Button } from './Button'

import { View } from './View'
import { StylesOf } from '../types/utility'
import { StyleSheet, ViewProps } from 'react-native'
import { AnimatedTouchable, Touchable } from './Touchable'
import { useAnimationState } from 'moti'

export type OverlayProps = ViewProps & {
  title?: ReactNode
  visible?: boolean
  showClose?: boolean
  variants?: ComponentVariants<typeof OverlayStyles>
  styles?: StylesOf<OverlayComposition>
  style?: any
  onPress?: () => void
} & React.ComponentPropsWithoutRef<typeof AnimatedTouchable>

export const Overlay: React.FC<OverlayProps> = (overlayProps) => {
  const {
    showClose,
    title,
    children,
    visible,
    styles = {},
    style,
    variants,
    ...props
  } = overlayProps

  const variantStyles = useDefaultComponentStyle('Overlay', {
    styles,
    transform: StyleSheet.flatten,
    variants: variants as any,
  }) as StylesOf<OverlayComposition>

  const animation = useAnimationState({
    visible: variantStyles['wrapper:visible'],
    hidden: styles['wrapper:visible'],
  })

  onUpdate(() => {
    animation.transitionTo(visible ? 'visible' : 'hidden')
  }, [visible])

  const viewStyles = [
    variantStyles.wrapper,
    styles.wrapper,
  ]

  return (
    <View animated state={animation} style={viewStyles}>
      <Touchable

        feedbackVariant='none'
        variants={['whole', 'full', 'absolute']}
        {...props}
      >
        {(title || showClose) && (
          <View style={variantStyles.header}>
            <InputLabel style={variantStyles.title} label={title} />
            {showClose && (
              <Button
                variants={['icon']}
                icon={'close' as IconPlaceholder}
                style={variantStyles.closeButton}
                debugName={'Close icon'}
              />
            )}
          </View>
        )}
      </Touchable>
    </View>
  )
}
