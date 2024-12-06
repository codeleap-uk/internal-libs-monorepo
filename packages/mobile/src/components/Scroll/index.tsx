import React, { forwardRef, useState } from 'react'
import { onUpdate, usePrevious } from '@codeleap/hooks'
import { deepEqual } from '@codeleap/utils'
import { ScrollView } from 'react-native'
import { RefreshControl } from '../RefreshControl'
import { useKeyboardPaddingStyle } from '../../utils'
import { ScrollProps, ScrollRef } from './types'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const Scroll = forwardRef<ScrollRef, ScrollProps>((scrollProps, ref) => {
  const {
    style,
    refreshTimeout,
    children,
    changeData,
    refreshControlProps = {},
    contentContainerStyle,
    keyboardAware,
    animated,
    ...props
  } = {
    ...Scroll.defaultProps,
    ...scrollProps,
  }

  const hasRefresh = !!props.onRefresh
  const [refreshingState, setRefreshing] = useState(false)
  const refreshingDisplay = props.refreshing !== undefined ? props.refreshing : refreshingState

  const timer = React.useRef(null)
  const previousData = usePrevious(changeData)

  const onRefresh = () => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    setRefreshing(true)

    props.onRefresh()

    timer.current = setTimeout(() => {
      setRefreshing(false)
    }, refreshTimeout)
  }

  onUpdate(() => {
    if (refreshingDisplay && !deepEqual(previousData, changeData)) {
      setRefreshing(false)
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [refreshingDisplay, changeData])

  const styles = useStylesFor(Scroll.styleRegistryName, style)

  const Component = ScrollView

  const keyboardStyle = useKeyboardPaddingStyle([styles?.content, contentContainerStyle], keyboardAware)

  return (
    <Component
      showsVerticalScrollIndicator={false}
      // @ts-ignore
      ref={ref}
      refreshControl={
        hasRefresh && (
          <RefreshControl
            refreshing={refreshingDisplay}
            onRefresh={onRefresh}
            {...refreshControlProps}
          />
        )
      }
      {...props}
      style={styles?.wrapper}
      contentContainerStyle={keyboardStyle}
    >
      {children}
    </Component>
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
  animated: true,
} as Partial<ScrollProps>

MobileStyleRegistry.registerComponent(Scroll)
