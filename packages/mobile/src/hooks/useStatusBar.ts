import { useIsFocused } from '@react-navigation/native'
import { useLayoutEffect } from '@codeleap/hooks'
import { StatusBar, StatusBarStyle } from 'react-native'

type UseStatusBarOptions = {
  statusBarColor?: StatusBarStyle
}

export function useStatusBar({ statusBarColor }: UseStatusBarOptions) {
  const focused = useIsFocused()

  useLayoutEffect(() => {
    if (!focused || !statusBarColor) return

    const statusBarEntry = StatusBar.pushStackEntry({ barStyle: statusBarColor })
    
    return () => {
      StatusBar.popStackEntry(statusBarEntry)
    }
  }, [statusBarColor, focused])
}
