import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useDefaultComponentStyle,
  usePrevious,
  useCodeleapContext,
} from '@codeleap/common'

import {
  KeyboardAwareScrollView as KBDView,
  // @ts-ignore
} from 'react-native-keyboard-aware-scroll-view'
import { RefreshControl, ScrollView, ScrollViewProps, ViewStyle } from 'react-native'
import { ViewProps } from './View'
import { KeyboardAwareScrollViewTypes } from '../modules'

type KeyboardAwareScrollViewProps = KeyboardAwareScrollViewTypes.KeyboardAwareScrollViewProps

export type ScrollProps = KeyboardAwareScrollViewProps &
  ViewProps & {
    onRefresh?: () => void
    refreshTimeout?: number
    changeData?: any
    keyboardAware?: boolean
    refreshing?: boolean
    styles?: ViewStyle
  }

const KeyboardAwareScrollView =
  KBDView as unknown as React.ForwardRefExoticComponent<
    ViewProps & {
      refreshControl?: JSX.Element
      ref?: ScrollView

    } & ScrollViewProps
  >

export const Scroll = forwardRef<ScrollView, ScrollProps>(
  (scrollProps, ref) => {
    const {
      variants = [],
      style,
      refreshTimeout = 3000,
      children,
      changeData,
      styles,
      keyboardAware = true,
      ...props
    } = scrollProps
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
    const { Theme } = useCodeleapContext()

    const variantStyles = useDefaultComponentStyle('View', {
      variants,
      styles: {
        wrapper: styles,
      },
      rootElement: 'wrapper',
    })

    const Component = keyboardAware ? KeyboardAwareScrollView : ScrollView

    return (
      <Component
        style={[Theme.presets.full, style]}
        contentContainerStyle={[variantStyles.wrapper]}
        ref={ref as unknown as ScrollView}
        refreshControl={
          hasRefresh && (
            <RefreshControl refreshing={refreshingDisplay} onRefresh={onRefresh} />
          )
        }
        {...props}
      >
        {children}
      </Component>
    )
  },
)
