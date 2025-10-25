import React, { useRef } from 'react'
import { ScrollView } from 'react-native'
import { ScrollProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { ScrollProvider, useScrollPubSub } from '../../modules/scroll'

export * from './styles'
export * from './types'

export const Scroll = (scrollProps: ScrollProps) => {
  const {
    style,
    refreshTimeout,
    children,
    refreshControlProps = {},
    contentContainerStyle,
    keyboardAware,
    ...props
  } = {
    ...Scroll.defaultProps,
    ...scrollProps,
  }

  const styles = useStylesFor(Scroll.styleRegistryName, style)

  const Component = keyboardAware ? KeyboardAwareScrollView : ScrollView

  const _scrollRef = useRef<ScrollView>(null)

  // @ts-ignore
  const { ref: scrollRef, emit } = useScrollPubSub(_scrollRef)

  return (
    <ScrollProvider ref={scrollRef}>
      <Component
        showsVerticalScrollIndicator={false}
        // @ts-ignore
        ref={_scrollRef}
        bottomOffset={30}
        {...props}
        style={styles?.wrapper}
        contentContainerStyle={[styles?.content, contentContainerStyle]}
        onMomentumScrollEnd={(e) => {
          emit('onMomentumScrollEnd', e)
          props?.onMomentumScrollEnd?.(e)
        }}
      >
        {children}
      </Component>
    </ScrollProvider>
  )
}

Scroll.styleRegistryName = 'Scroll'
Scroll.elements = ['wrapper', 'content']
Scroll.rootElement = 'wrapper'

Scroll.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Scroll as (props: StyledComponentProps<ScrollProps, typeof styles>) => IJSX
}

Scroll.defaultProps = {
  keyboardShouldPersistTaps: 'handled',
  refreshTimeout: 3000,
  keyboardAware: true,
} as Partial<ScrollProps>

MobileStyleRegistry.registerComponent(Scroll)
