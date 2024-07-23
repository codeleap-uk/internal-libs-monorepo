import React from 'react'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { useAnimatedVariantStyles } from '../../utils'
import { BackdropProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const Backdrop = (props: BackdropProps) => {
  const {
    visible,
    children,
    wrapperProps = {},
    style,
    ...rest
  } = {
    ...Backdrop.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Backdrop.styleRegistryName, style)

  const animation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['wrapper:hidden', 'wrapper:visible'],
    updater: (s) => {
      'worklet'
      return visible ? s['wrapper:visible'] : s['wrapper:hidden']
    },
    dependencies: [visible],
    transition: styles.transition,
  })

  const isPressable = !!props?.onPress

  return (
    <View
      animated
      pointerEvents={visible ? 'auto' : 'none'}
      animatedStyle={animation}
      {...wrapperProps}
      style={styles.wrapper}
    >
      {isPressable
        ? <Touchable {...rest} style={styles.touchable} noFeedback android_ripple={null} />
        : null}

      {children}
    </View>
  )
}


Backdrop.styleRegistryName = 'Backdrop'
Backdrop.elements = ['wrapper', 'touchable', 'transition']
Backdrop.rootElement = 'wrapper'

Backdrop.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Backdrop as (props: StyledComponentProps<BackdropProps, typeof styles>) => IJSX
}

Backdrop.defaultProps = {} as Partial<BackdropProps>

MobileStyleRegistry.registerComponent(Backdrop)
