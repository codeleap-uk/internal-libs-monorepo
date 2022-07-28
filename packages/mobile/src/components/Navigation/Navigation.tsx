// @ts-nocheck
import * as React from 'react'
import {
  TypeGuards,
} from '@codeleap/common'
import { Icon } from '../Icon'
import { NavigationProps, NavigatorType, PropTypes, TNavigators } from './types'
import { Navigators } from './constants'

export const Navigation = <T extends NavigatorType>({ type, scenes, ...props }: NavigationProps<T>) => {
  const NavigationComponent = Navigators[type] as TNavigators[T]

  // console.log('render Navigation', { type, scenes, props, defaultProps })

  return <NavigationComponent.Navigator {...props}>
    {
      Object.entries(scenes).map(([name, content], idx) => {
        const isFunction = TypeGuards.isFunction(content)

        let screenProps = {
          name,
        } as PropTypes[T]['Screen']

        if (isFunction) {
          screenProps.component = content
          // console.log('Render NavigationScreen', { scenes, screenProps, content, isFunction }, 'PACKAGES')
        } else {
          screenProps.component = content?.component?.default || content?.component || content?.default
          const nameParts = name.split('.')
          const title = content?.title || nameParts[nameParts.length - 1] || name.replace('.', '')

          screenProps = {
            ...screenProps,
            options: (optionProps) => ({
              title,
              tabBarIcon: (style) => <Icon name={content?.icon} style={style}/>,
              tabBarIconFocused: content?.iconFocused ? (style) => <Icon name={content?.iconFocused} style={style}/> : null,
              ...(TypeGuards.isFunction(content.options) ? content.options(optionProps) : content.options),
            }),
          }
          // console.log('Render NavigationScreen loop', { scenes, screenProps, content, title, isFunction, props }, 'PACKAGES')
        }

        return (
          // @ts-ignore
          <NavigationComponent.Screen
            key={idx}
            {...screenProps}
          />
        )
      })
    }
  </NavigationComponent.Navigator>
}
