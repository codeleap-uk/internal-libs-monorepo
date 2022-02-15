import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useComponentStyle,
  usePrevious,
  useStyle,
} from '@codeleap/common'
import {
  KeyboardAwareScrollViewProps,
  KeyboardAwareScrollView as KBDView,
} from 'react-native-keyboard-aware-scroll-view'
import { RefreshControl, ScrollView, ScrollViewProps } from 'react-native'
import { ViewProps } from './View'

export type ScrollProps = KeyboardAwareScrollViewProps &
  ViewProps & {
    onRefresh?: () => void;
    refreshTimeout?: number;
    changeData?: any;
  };

const KeyboardAwareScrollView =
  KBDView as unknown as React.ForwardRefExoticComponent<
    ViewProps & {
      refreshControl?: JSX.Element;
      ref?: ScrollView;
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
      ...props
    } = scrollProps
    const hasRefresh = !!props.onRefresh
    const [refreshing, setRefreshing] = useState(false)

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
      if (refreshing && !deepEqual(previousData, changeData)) {
        setRefreshing(false)
        if (timer.current) {
          clearTimeout(timer.current)
        }
      }
    }, [refreshing, changeData])
    const { Theme } = useStyle()

    const variantStyles = useComponentStyle('View', {
      variants,
    })

    return (
      <KeyboardAwareScrollView
        style={[Theme.presets.full, style]}
        contentContainerStyle={[variantStyles.wrapper]}
        ref={ref as unknown as ScrollView}
        {...props}
        refreshControl={
          hasRefresh && (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          )
        }
      >
        {children}
      </KeyboardAwareScrollView>
    )
  },
)
