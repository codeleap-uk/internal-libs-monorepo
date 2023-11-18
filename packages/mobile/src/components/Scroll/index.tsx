import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useDefaultComponentStyle,
  usePrevious,
} from '@codeleap/common'

import { RefreshControl, RefreshControlProps, ScrollView, StyleSheet } from 'react-native'
import { ViewProps } from '../View'
import { KeyboardAwareScrollViewTypes } from '../../modules'
import { StylesOf } from '../../types'
import { ScrollComposition, ScrollStyles } from './styles'
import { GetKeyboardAwarePropsOptions, useKeyboardAwareView, useKeyboardPaddingStyle } from '../../utils'
import { ScrollView as MotiScrollView } from 'moti'
// import { KeyboardAwareScrollView } from '../../utils'

type KeyboardAwareScrollViewProps = KeyboardAwareScrollViewTypes.KeyboardAwareScrollViewProps

export type ScrollProps = KeyboardAwareScrollViewProps &
  ViewProps & {
    onRefresh?: () => void
    refreshTimeout?: number
    changeData?: any
    keyboardAware?: GetKeyboardAwarePropsOptions
    refreshing?: boolean
    styles?: StylesOf<ScrollComposition>
    refreshControlProps?: Partial<RefreshControlProps>
    debugName?: string
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
      contentContainerStyle,
      keyboardAware,
      debugName = '',
      animated = true,
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

    const variantStyles = useDefaultComponentStyle<'u:Scroll', typeof ScrollStyles>('u:Scroll', {
      variants,
      styles,
      transform: StyleSheet.flatten,
      rootElement: 'content',
    })

    const refreshStyles = StyleSheet.flatten([variantStyles.refreshControl, styles.refreshControl])
    const _scrollProps = {
      style: [variantStyles.wrapper, style],
      ref: ref as unknown as ScrollView,
      refreshControl: hasRefresh && (
        <RefreshControl
          refreshing={refreshingDisplay}
          onRefresh={onRefresh}
          tintColor={refreshStyles?.color}
          colors={[refreshStyles?.color]}
          {...refreshControlProps}
        />
      ),
      ...props,
    }

    const Component = animated ? MotiScrollView : ScrollView
    const keyboardStyle = useKeyboardPaddingStyle(
      [variantStyles.content, contentContainerStyle],
      keyboardAware?.enabled,
    )

    return (
      <Component
        {..._scrollProps}
        contentContainerStyle={keyboardStyle}
      >
        {children}
      </Component>
    )
  },
)
export * from './styles'
