import * as React from 'react'
import {
  ComponentVariants,
  IconPlaceholder,
  OverlayComposition,
  OverlayStyles,
  useComponentStyle,
} from '@codeleap/common'
import { ReactNode } from 'react'
import { InputLabel } from './TextInput'
import { Button } from './Button'

import { View } from './View'
import { StylesOf } from '../types/utility'
import { StyleSheet, ViewProps } from 'react-native'
import { AnimatedTouchable } from './Touchable'

export type OverlayProps = ViewProps & {
  title?: ReactNode;
  visible?: boolean;
  showClose?: boolean;
  variants?: ComponentVariants<typeof OverlayStyles>;
  styles?: StylesOf<OverlayComposition>;
  style?: any;
  onPress?: () => void;
} & React.ComponentPropsWithoutRef<typeof AnimatedTouchable>;

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

  const variantStyles = useComponentStyle('Overlay', {
    styles,
    transform: StyleSheet.flatten,
    variants: variants as any,
  })

  const touchableStyle = [
    variantStyles.wrapper,
    styles.wrapper,
    visible && variantStyles['wrapper:visible'],
    visible && styles['wrapper:visible'],
  ]

  return (
    <AnimatedTouchable
      // @ts-ignore
      transition={'opacity'}
      style={touchableStyle}
      {...props}
    >
      <View>
        {(title || showClose) && (
          <View style={variantStyles.header}>
            <InputLabel style={variantStyles.title} label={title} />
            {showClose && (
              <Button
                variants={['icon']}
                icon={'close' as IconPlaceholder}
                style={variantStyles.closeButton}
              />
            )}
          </View>
        )}
      </View>
    </AnimatedTouchable>
  )
}
