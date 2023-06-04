import React from 'react'
export { createStackNavigator } from '@react-navigation/stack'
export { createDrawerNavigator } from '@react-navigation/drawer'
export { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainerRefContext, NavigationContext } from '@react-navigation/core'
export { useIsFocused } from '@react-navigation/native'

export function useNavigationContext() {
  const root = React.useContext(NavigationContainerRefContext)
  const navigation = React.useContext(NavigationContext)
  if (!navigation && !root) return undefined

  return (navigation ?? root)
}
