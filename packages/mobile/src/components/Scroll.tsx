import * as React from 'react'
import { forwardRef, useState } from 'react'
import { useStyle } from '@codeleap/common'
import { KeyboardAwareScrollViewProps, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RefreshControl, ScrollView, View } from 'react-native'
import { onUpdate, usePrevious } from '@codeleap/common'
import equals from 'deep-equal'
import { useTimer } from 'react-timer-hook'

export type ScrollProps = KeyboardAwareScrollViewProps & any

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

  const {
    Theme
  } = useStyle()

  return (
    //@ts-ignore
    <KeyboardAwareScrollView
      style={[Theme.presets.full, style]}
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