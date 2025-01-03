import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import type { TypedNavigator } from '@react-navigation/core'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

type X = TypedNavigator<
  any,
  any
>

type INavigators = {
  Drawer: X
  Stack: X
  Tab: X
}

export const Navigators:INavigators = {
  Drawer: createDrawerNavigator(),
  Stack: createStackNavigator(),
  Tab: createBottomTabNavigator(),
}
