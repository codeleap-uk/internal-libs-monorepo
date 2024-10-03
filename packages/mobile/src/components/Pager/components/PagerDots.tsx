import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { Touchable } from '../../Touchable'
import { View } from '../../View'
import { uuid } from '../../..'

function Dot({ onPress, isActive, index, styles }) {
  const animation = useAnimatedStyle(() => {
    const scale = isActive ? 1 : 0.6
    return {
      transform: [{ scale }],
      ...(isActive ? styles['dot:active'] : styles.dot),
    }
  })

  return (
    <Touchable
      debugName={`dot-touchable-${index}`}
      onPress={onPress}
      noFeedback
      style={[styles.touchable, isActive && styles['touchable:active']]}
    >
      <Animated.View style={[animation, styles.dot]} />
    </Touchable>
  )
}

export function PagerDots({ styles, currentPage, setCurrentPage, pages }) {
  return (
    <View style={styles.wrapper}>
      {pages?.map((_, i) => (
        <Dot
          key={`${uuid.v1}-index-${i}`}
          index={i}
          onPress={() => setCurrentPage(i)}
          isActive={i === currentPage}
          styles={styles}
        />
      ))}
    </View>
  )
}
