import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef, ElementType, ComponentType, useState } from 'react'
import { ComponentVariants, useComponentStyle, BaseViewProps, ButtonStyles, ButtonComposition } from '@codeleap/common'
import { StylesOf } from '../types/utility'
import { Touchable } from '@codeleap/mobile/src'
import { KeyboardAwareScrollViewProps, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RefreshControl, ScrollView, View } from 'react-native'
import { onUpdate, usePrevious } from '@codeleap/common'
import equals from 'deep-equal'
import { useTimer } from 'react-timer-hook'

export type ScrollProps = KeyboardAwareScrollViewProps

export const Scroll = forwardRef<KeyboardAwareScrollView, ScrollProps>((scrollProps, ref) => {
  const { 
    variants = [], 
    style,
    children,
    ...props
  } = scrollProps

  const [refreshing, setRefreshing] = useState(false)
  const prevProps = usePrevious(props)

  let setTimeout = () => null
  if (props.hasOwnProperty('onRefresh')) {
    setTimeout = useTimer({ expiryTimestamp: new Date(), onExpire: () => setRefreshing(false) }).restart
  }

  onUpdate(() => {
    if (refreshing && props.extraData) {
      if (!equals(props.extraData, prevProps.extraData)) {
        setRefreshing(false)
      }
    }
  })

  const onRefresh = () => {
    setRefreshing(true)
    props.onRefresh()
    const time = new Date()
    time.setSeconds(time.getSeconds() + 3)
    setTimeout(time)
  }

  return (
    <KeyboardAwareScrollView
      style={[{ width: '100%', height: '100%' }, style]}
      ref={ref} {...props}
      refreshControl={
        props.onRefresh &&
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
      }
    > 
        { children }
    </KeyboardAwareScrollView>
  )
})