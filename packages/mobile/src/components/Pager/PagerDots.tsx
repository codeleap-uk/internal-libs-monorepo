import { AnyFunction, StylesOf } from '@codeleap/common'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { DotComposition } from './styles'

export type PagerDot = {
  onPress: AnyFunction
  isActive: boolean
  index: number
  styles: StylesOf<DotComposition>
}

function Dot({ onPress, isActive, index, styles }: PagerDot) {
  const animation = useAnimatedStyle(() => {
    const scale = isActive ? 1 : 0.6
    return {
      transform: [{ scale }],
      ...(isActive ? styles['dot:active'] : styles.dot),
    }
  })

  return (
    <Touchable
      debugName={`default-pager-dot-touchable-${index}`}
      onPress={onPress}
      noFeedback
      style={[styles.touchable, isActive && styles['touchable:active']]}
    >
      <Animated.View style={[animation, styles.dot]} />
    </Touchable>
  )
}

export type PagerDots = {
  styles: StylesOf<DotComposition>
  currentPage: number
  setCurrentPage: (page: number) => void
  pages: Array<any>
}

export function PagerDots({ styles, currentPage, setCurrentPage, pages }: PagerDots) {
  return (
    <View style={styles.wrapper}>
      {pages?.map((_, i) => (
        <Dot
          key={`default-pager-dots-index-${i}`}
          index={i}
          onPress={() => setCurrentPage(i)}
          isActive={i === currentPage}
          styles={styles}
        />
      ))}
    </View>
  )
}
