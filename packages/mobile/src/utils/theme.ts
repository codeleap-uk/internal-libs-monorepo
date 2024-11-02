import { Platform, Dimensions, StyleSheet } from 'react-native'
import DeviceInfo from 'react-native-device-info'

type Options = {
  getStatusBarHeight?: () => number
}

export function getMobileThemeValues(initialWindowMetrics, options: Options = {}) {
  const screenDimensions = Dimensions.get('screen')

  const hasNotch = DeviceInfo.hasNotch()
  const hasIsland = DeviceInfo.hasDynamicIsland()
  const bottomNavHeight = Platform.OS === 'android' ? initialWindowMetrics?.insets?.bottom : 0

  const prefersConstantNavigationBar = bottomNavHeight > 0

  const safeAreaTop = Platform.OS === 'ios' ? (hasNotch ? 34 + (hasIsland ? 12 : 0) : 20) : (options?.getStatusBarHeight?.() || 0)

  const safeAreaBottom = (hasNotch && !prefersConstantNavigationBar ? 20 : 0)
  return {
    ...screenDimensions,
    pixel: StyleSheet.hairlineWidth,
    hasNotch,
    hasIsland,
    prefersConstantNavigationBar,
    safeAreaTop,
    safeAreaBottom,
    keyboardVerticalOffset: Platform.OS === 'ios' ? 57 : 47,
    bottomNavHeight,
    get window() {
      return {
        height: screenDimensions.height - (bottomNavHeight + safeAreaTop),
        width: screenDimensions.width,
      }
    },
  }
}
