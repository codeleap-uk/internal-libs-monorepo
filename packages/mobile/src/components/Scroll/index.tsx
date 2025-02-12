import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import { RefreshControl } from '../RefreshControl'
import { ScrollProps, ScrollRef } from './types'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { ScrollProvider, useScrollPubSub } from '../../modules/scroll'

export * from './styles'
export * from './types'

export const Scroll = forwardRef<ScrollRef, ScrollProps>((scrollProps, ref) => {
  const {
    style,
    refreshTimeout,
    children,
    refreshControlProps = {},
    contentContainerStyle,
    keyboardAware,
    onRefresh: onRefresh,
    ...props
  } = {
    ...Scroll.defaultProps,
    ...scrollProps,
  }

  const hasRefresh = !!onRefresh
  const [refreshing, setRefreshing] = useState(false)
  const refreshingDisplay = props.refreshing !== undefined ? props.refreshing : refreshing

  const timer = React.useRef(null)

  const refresh = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }

    setRefreshing(true)

    onRefresh?.()

    timer.current = setTimeout(() => {
      setRefreshing(false)
    }, refreshTimeout)
  }, [onRefresh])

  const styles = useStylesFor(Scroll.styleRegistryName, style)

  const Component = keyboardAware ? KeyboardAwareScrollView : ScrollView

  const _scrollRef = useRef<ScrollView>()

  const { ref: scrollRef, emit } = useScrollPubSub(_scrollRef)

  useImperativeHandle(ref, () => scrollRef.current as unknown as  ScrollView, [])

  return (
    <ScrollProvider ref={scrollRef}>
      <Component
        showsVerticalScrollIndicator={false}
        // @ts-ignore
        ref={_scrollRef}
        refreshControl={
          hasRefresh && (
            <RefreshControl
              refreshing={refreshingDisplay}
              onRefresh={refresh}
              {...refreshControlProps}
            />
          )
        }
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
}) as StyledComponentWithProps<ScrollProps>

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
