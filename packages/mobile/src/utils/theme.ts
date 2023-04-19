import { Platform, Dimensions, StatusBar, StyleSheet } from 'react-native'
import  DeviceInfo  from 'react-native-device-info'

type AppValues = {
  headerHeight: number
  tabBarHeight: number
}

export function getMobileThemeValues(initialWindowMetrics, values: AppValues) {
  const screenDimensions = Dimensions.get('screen')

  const hasNotch = DeviceInfo.hasNotch()
  const hasIsland = DeviceInfo.hasDynamicIsland()
  const bottomNavHeight = Platform.OS === 'android' ? initialWindowMetrics?.insets?.bottom : 0

  const prefersConstantNavigationBar = bottomNavHeight > 0

  const safeAreaTop = Platform.OS === 'ios' ? (hasNotch ? 34 + (hasIsland ? 12 : 0) : 20) : StatusBar.currentHeight

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
