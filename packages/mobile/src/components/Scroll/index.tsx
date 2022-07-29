import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useDefaultComponentStyle,
  usePrevious,
  useCodeleapContext,
} from '@codeleap/common'

import { RefreshControl, RefreshControlProps, ScrollView, StyleSheet } from 'react-native'
import { ViewProps } from '../View'
import { KeyboardAwareScrollViewTypes } from '../../modules'
import { StylesOf } from '../../types'
import { ScrollComposition, ScrollStyles } from './styles'
import { KeyboardAwareScrollView } from '../../utils'

type KeyboardAwareScrollViewProps = KeyboardAwareScrollViewTypes.KeyboardAwareScrollViewProps

export type ScrollProps = KeyboardAwareScrollViewProps &
  ViewProps & {
    onRefresh?: () => void
    refreshTimeout?: number
    changeData?: any
    keyboardAware?: boolean
    refreshing?: boolean
    styles?: StylesOf<ScrollComposition>
    refreshControlProps?: Partial<RefreshControlProps>
  }

export const Scroll = forwardRef<ScrollView, ScrollProps>(
  (scrollProps, ref) => {
    const {
      variants = [],
      style,
      refreshTimeout = 3000,
      children,
      changeData,
      styles = {},
      refreshControlProps = {},
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

    const variantStyles = useDefaultComponentStyle<'u:Scroll', typeof ScrollStyles>('u:Scroll', {
      variants,
      styles,
      transform: StyleSheet.flatten,
      rootElement: 'wrapper',
    })

    const Component = keyboardAware ? KeyboardAwareScrollView : ScrollView
    const refreshStyles = StyleSheet.flatten([variantStyles.refreshControl, styles.refreshControl])
    return (
      <Component
        style={[Theme.presets.full, style]}
        contentContainerStyle={[variantStyles.wrapper]}
        ref={ref as unknown as ScrollView}
        refreshControl={
          hasRefresh && (
            <RefreshControl
              refreshing={refreshingDisplay}
              onRefresh={onRefresh}
              tintColor={refreshStyles?.color}
              colors={[refreshStyles?.color]}
              {...refreshControlProps}
            />
          )
        }
        {...props}
      >
        {children}
      </Component>
    )
  },
)
export * from './styles'
