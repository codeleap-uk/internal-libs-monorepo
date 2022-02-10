// @ts-nocheck
import * as React from 'react'
import { RouteConfig } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
// import { createNativeStackNavigator as createStackNavigator, NativeStackScreenProps as StackScreenProps } from '@react-navigation/native-stack'
import {
  AnyFunction,
  EnhancedTheme,
  useStyle,
} from '@codeleap/common'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from './Icon'

export type AppScenes = {
  [x: string]: {
    [y: string]:
      | AnyFunction
      | (Partial<Pick<RouteConfig<any, any, any, any, any>, 'options'>> & {
          render: AnyFunction;
          icon?: any;
        });
  };
};

const parseModulePages = (pageModule: string, [pageName, Component]) => {
  const name = `${pageModule}.${pageName}`

  let props = {
    name,
    key: name,
    options: {
      title: pageName,
    },
    component: null,
  }

  switch (typeof Component) {
    case 'function':
      props.component = Component
    case 'object':
      props = {
        ...props,
        ...Component,
      }

      if (typeof Component.default === 'function') {
        props.component = Component?.default
      }

      if (Component.render) {
        props.component =
          typeof Component.render === 'function'
            ? Component.render
            : Component?.render?.default
      }

    default:
      break
  }

  return props
}

type FlattenScenesArgs = {
  scenes: AppScenes;
  Theme: EnhancedTheme<any>;
};
const flattenScenes = ({ scenes }: FlattenScenesArgs) => {
  return Object.entries(scenes).reduce((acc, [pageModule, pages]) => {
    const thisModulePages = {}
    for (const pageData of Object.entries(pages)) {
      const parsedData = parseModulePages(pageModule, pageData)

      thisModulePages[parsedData.name] = parsedData
    }
    return { ...acc, ...thisModulePages }
  }, {})
}

const Navigators = {
  drawer: createDrawerNavigator(),
  stack: createStackNavigator(),
  // stack: createNativeStackNavigator(),
  tab: createBottomTabNavigator(),
}
type NavigationType = keyof typeof Navigators;
type NavigationProps<T extends NavigationType> = {
  scenes: AppScenes;
  type: T;
} & React.ComponentPropsWithoutRef<typeof Navigators[T]['Navigator']>;

export const Navigation = <
  T extends NavigationType,
  P extends NavigationProps<T> = NavigationProps<T>
>({
    type,
    scenes,
    ...props
  }: P) => {
  const Navigator: typeof Navigators[T] = Navigators[type]
  const { Theme } = useStyle()
  const flatScenes = flattenScenes({
    Theme,
    scenes,
  })

  const otherProps = props as any
  // @ts-ignore
  const screenOptions: P['screenOptions'] = ({ route, navigation }) => {
    const propOptions =
      typeof (otherProps?.screenOptions || {}) === 'function'
        ? otherProps.screenOptions({ route, navigation })
        : otherProps?.screenOptions

    return {
      ...propOptions,
      tabBarIcon: (style) => {
        if (flatScenes?.[route.name]?.icon) {
          return <Icon name={flatScenes?.[route.name]?.icon} style={style} />
        }
        return null
      },
    }
  }

  return (
    <Navigator.Navigator {...otherProps} screenOptions={screenOptions}>
      {Object.values(flatScenes).map((props) => (
        <Navigator.Screen {...(props as any)} />
      ))}
    </Navigator.Navigator>
  )
}
export type NavigationScreenProps<
  T extends StackScreenProps<any, any> = StackScreenProps<any, any>
> = Omit<T, 'navigation'> & {
  navigation: Omit<T['navigation'], 'navigate'> & {
    navigate: (to: string) => void;
  };
};
