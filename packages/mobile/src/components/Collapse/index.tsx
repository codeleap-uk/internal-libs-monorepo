import React, { useEffect } from 'react'
import { ViewProps } from 'react-native'
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { View } from 'react-native'
import { CollapseProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

const animationConfig = {
  duration: 300,
  easing: Easing.inOut(Easing.quad),
}

export const Collapse = (props: CollapseProps) => {
  const {
    open,
    children,
    style,
    ...rest
  } = {
    ...Collapse.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Collapse.styleRegistryName, style)

  const height = useSharedValue(0)
  const animatedHeight = useSharedValue(0)

  useEffect(() => {
    animatedHeight.value = withTiming(open ? height.value : 0, animationConfig)
  }, [open])

  const onLayout = (event: any) => {
    const measuredHeight = event.nativeEvent.layout.height

    if (measuredHeight) {
      height.value = measuredHeight

      if (open) {
        animatedHeight.value = withTiming(measuredHeight, animationConfig)
      }
    }
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: height.value === 0 ? 'auto' : animatedHeight.value,
      overflow: 'hidden',
    }
  }, [animatedHeight, open])

  return (
    <Animated.View style={[animatedStyle, styles.wrapper]} {...rest}>
      <View onLayout={onLayout}>
        {children}
      </View>
    </Animated.View>
  )
}

Collapse.styleRegistryName = 'Collapse'
Collapse.elements = ['wrapper', 'content']
Collapse.rootElement = 'wrapper'


Collapse.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Collapse as (props: StyledComponentProps<CollapseProps, typeof styles>) => IJSX
}

Collapse.defaultProps = {
  open: false,
} as Partial<CollapseProps>

MobileStyleRegistry.registerComponent(Collapse)