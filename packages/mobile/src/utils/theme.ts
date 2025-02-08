import { Platform, Dimensions, StyleSheet } from 'react-native'
import DeviceInfo from 'react-native-device-info'

type Options = {
  statusBarHeight?: number
  getStatusBarHeight?: () => number
  getAndroidNavbarHeight?: () => number
}

export function getMobileThemeValues(initialWindowMetrics, options: Options = {}) {
  const { statusBarHeight, getStatusBarHeight, getAndroidNavbarHeight } = options

  const screenDimensions = Dimensions.get('screen')

  const hasNotch = DeviceInfo.hasNotch()
  const hasIsland = DeviceInfo.hasDynamicIsland()
  const bottomNavHeight = Platform.OS === 'android' ? getAndroidNavbarHeight?.() ?? 0 : 0

  const prefersConstantNavigationBar = bottomNavHeight > 0

  const currStatusBarHeight = typeof statusBarHeight === 'number' ? statusBarHeight : getStatusBarHeight?.() || 0
  const safeAreaTop = Platform.OS === 'ios' ? (hasNotch ? 34 + (hasIsland ? 12 : 0) : 20) : currStatusBarHeight

  const safeAreaBottom = Platform.select({
    ios: hasNotch && !prefersConstantNavigationBar ? 20 : 0,
    android: bottomNavHeight ?? initialWindowMetrics?.insets.bottom ?? 0,
  })

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
        height: screenDimensions.height - (safeAreaBottom + safeAreaTop),
        width: screenDimensions.width,
      }
    },
  }
}
