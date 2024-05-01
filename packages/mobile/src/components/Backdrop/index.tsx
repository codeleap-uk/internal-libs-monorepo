import React from 'react'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { useAnimatedVariantStyles } from '../../utils'
import { BackdropProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'

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

  const styles = MobileStyleRegistry.current.styleFor(Backdrop.styleRegistryName, style)

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
      style={[styles.wrapper, animation]}
      {...wrapperProps}
    >
      {
        isPressable
          ? <Touchable style={styles.touchable} {...rest} noFeedback android_ripple={null} />
          : null
      }

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

Backdrop.defaultProps = {}

MobileStyleRegistry.registerComponent(Backdrop)
