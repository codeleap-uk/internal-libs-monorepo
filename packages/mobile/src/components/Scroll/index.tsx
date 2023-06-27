import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useDefaultComponentStyle,
  usePrevious,
} from '@codeleap/common'
import { ScrollView, StyleSheet } from 'react-native'
import { ViewProps } from '../View'
import { RefreshControl, RefreshControlProps } from '../RefreshControl'
import { StylesOf } from '../../types'
import { ScrollComposition, ScrollPresets } from './styles'
import { GetKeyboardAwarePropsOptions } from '../../utils'
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view'

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

export type ScrollRef = KeyboardAwareScrollView

export const Scroll = forwardRef<ScrollRef, ScrollProps>(
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

    const variantStyles = useDefaultComponentStyle<'u:Scroll', typeof ScrollPresets>('u:Scroll', {
      variants,
      styles,
      transform: StyleSheet.flatten,
      rootElement: 'content',
    })

    const Component = KeyboardAwareScrollView

    return (
      <Component
        style={[variantStyles.wrapper, style]}
        contentContainerStyle={[variantStyles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        // @ts-ignore
        ref={ref}
        refreshControl= {
          hasRefresh && (
            <RefreshControl
              refreshing={refreshingDisplay}
              onRefresh={onRefresh}
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
) as unknown as (props:ScrollProps) => JSX.Element
export * from './styles'
