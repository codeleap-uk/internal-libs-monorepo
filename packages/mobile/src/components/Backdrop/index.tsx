import React from 'react'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { } from '../../utils'
import { BackdropProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { FadeIn, FadeOut } from 'react-native-reanimated'

export * from './styles'
export * from './types'

export const Backdrop = (props: BackdropProps) => {
  const {
    visible,
    children,
    wrapperProps = {},
    style,
    entering,
    exiting,
    ...rest
  } = {
    ...Backdrop.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Backdrop.styleRegistryName, style)

  const isPressable = !!props?.onPress

  if (!visible) return null

  return (
    <View.Animated
      pointerEvents={visible ? 'auto' : 'none'}
      entering={entering}
      exiting={exiting}
      {...wrapperProps}
      style={styles.wrapper}

    >
      {isPressable
        ? <Touchable {...rest} style={styles.touchable} noFeedback android_ripple={null} />
        : null}

      {children}
    </View.Animated>
  )
}

Backdrop.styleRegistryName = 'Backdrop'
Backdrop.elements = ['wrapper', 'touchable', 'transition']
Backdrop.rootElement = 'wrapper'

Backdrop.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Backdrop as (props: StyledComponentProps<BackdropProps, typeof styles>) => IJSX
}

Backdrop.defaultProps = {
  entering: FadeIn.duration(100).build(),
  exiting: FadeOut.duration(100).delay(100).build(),
} as Partial<BackdropProps>

MobileStyleRegistry.registerComponent(Backdrop)
