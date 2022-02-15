import { createBottomTabNavigator, createDrawerNavigator, createStackNavigator } from '../../modules/reactNavigation'

export const Navigators = {
  Drawer: createDrawerNavigator(),
  Stack: createStackNavigator(),
  Tab: createBottomTabNavigator(),
}
