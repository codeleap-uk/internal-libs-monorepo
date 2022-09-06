import { Platform, Dimensions, StatusBar, StyleSheet } from 'react-native'

export function getMobileThemeValues(initialWindowMetrics) {
  const screenDimensions = Dimensions.get('screen')

  const hasNotch = Platform.OS === 'ios' ? (Dimensions.get('window').height >= 812) : (initialWindowMetrics?.insets?.top > 24 || StatusBar.currentHeight > 24)
  const bottomNavHeight = Platform.OS === 'android' ? initialWindowMetrics?.insets?.bottom : 0

  const prefersConstantNavigationBar = bottomNavHeight > 0

  const safeAreaTop = Platform.OS === 'ios' ? (hasNotch ? 34 : 20) : StatusBar.currentHeight

  const safeAreaBottom = (hasNotch && !prefersConstantNavigationBar ? 20 : 0)
  return {
    ...screenDimensions,

    pixel: StyleSheet.hairlineWidth,
    hasNotch,
    prefersConstantNavigationBar,
    safeAreaTop,
    safeAreaBottom,
    keyboardVerticalOffset: Platform.OS === 'ios' ? 57 : 47,
    get headerHeight() { return 48 },
    get tabBarHeight() { return 63 + (prefersConstantNavigationBar ? 0 : this.safeAreaBottom) },
    bottomNavHeight,
    get window() {
      return {
        height: screenDimensions.height - (bottomNavHeight + safeAreaTop),
        width: screenDimensions.width,
      }
    },
    transitions: {
      modal: {
        duration: 100,
        type: 'timing',
      },
    },
    buttons: {
      small: {
        height: 40,
      },
      default: {
        height: 50,
      },
      large: {
        height: 60,
      },
    },
  } as const
}
