import React, { useCallback, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { FadeOut, FadeIn } from 'react-native-reanimated'
import { inputOverlayManager } from './store'
import { DetectorProps, InterceptorProps, LayoutProps } from './types'

export * from './store'

const Detector = ({ children, style, withWrapper = true }: DetectorProps) => {
  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      inputOverlayManager.closeAll()
    })
    .runOnJS(true)

  if (!withWrapper) {
    <GestureDetector gesture={tapGesture}>
      {children}
    </GestureDetector>
  }

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={[style, styles.detectorContainer]}>
        {children}
      </View>
    </GestureDetector>
  )
}

const Interceptor = ({ children }: InterceptorProps) => {
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      // Intercepts the tap to prevent it from propagating to the parent
      // Does nothing, just consumes the event
    })
    .runOnJS(true)

  return (
    <GestureDetector gesture={tapGesture}>
      {children}
    </GestureDetector>
  )
}

const Layout = (props: LayoutProps) => {
  const {
    style,
    children,
    hideOverlay = false,
    isOpen,
    animationDuration = 150,
    mode = 'overlay',
    position,
    gap,
    content,
    id,
  } = props

  const [inputHeight, setInputHeight] = useState(0)

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const height = event?.nativeEvent?.layout?.height ?? 0
    setInputHeight(height)
  }, [])

  const isOverlayMode = mode === 'overlay'

  const shouldShowOverlay = isOpen && !hideOverlay

  const overlayStyle = isOverlayMode ? {
    position: 'absolute' as const,
    zIndex: 1,
    [position]: 0,
    top: inputHeight + gap,
  } : {
    marginTop: gap,
  }

  return (
    <View style={[style, styles.layoutContainer]} onLayout={handleLayout}>
      {children}

      {shouldShowOverlay ? (
        <Interceptor>
          <Animated.View
            exiting={FadeOut.duration(animationDuration)}
            entering={FadeIn.duration(animationDuration)}
            style={overlayStyle}
          >
            {content}
          </Animated.View>
        </Interceptor>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  detectorContainer: {
    flex: 1,
  },
  layoutContainer: {
    position: 'relative',
  },
})

export const InputOverlay = {
  Detector,
  Interceptor,
  Layout,
}
