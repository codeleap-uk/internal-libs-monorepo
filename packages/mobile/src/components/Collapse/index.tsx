import React, { useCallback, useEffect } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { CollapseAnimationConfig, CollapseProps } from './types'
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

export * from './types'

export const Collapse = (props: CollapseProps) => {
  const {
    open,
    children,
    style,
    contentContainerStyle,
    animationConfig,
    ...rest
  } = {
    ...Collapse.defaultProps,
    ...props,
  }

  const height = useSharedValue(0)
  const animatedHeight = useSharedValue(0)

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const measuredHeight = event.nativeEvent.layout.height

    if (height.value != 0) return

    if (measuredHeight) {
      height.value = measuredHeight

      if (open) {
        animatedHeight.value = withTiming(measuredHeight, animationConfig)
      }
    }
  }, [open])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: height.value === 0 ? 'auto' : animatedHeight.value,
      overflow: 'hidden',
    }
  })

  useEffect(() => {
    animatedHeight.value = withTiming(open ? height.value : 0, animationConfig)
  }, [open])

  return (
    <Animated.View {...rest} style={[animatedStyle, style]}>
      <View onLayout={onLayout} style={contentContainerStyle}>
        {children}
      </View>
    </Animated.View>
  )
}

const defaultAnimationConfig: CollapseAnimationConfig = {
  duration: 300,
  easing: Easing.inOut(Easing.quad),
}

Collapse.defaultProps = {
  animationConfig: defaultAnimationConfig,
} as CollapseProps
