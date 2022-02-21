// @ts-nocheck
import * as React from 'react'
import {
  TypeGuards,
} from '@codeleap/common'
import { Icon } from '../Icon'
import { NavigationProps, NavigatorType, PropTypes, TNavigators } from './types'
import { Navigators } from './constants'

export const Navigation = <T extends NavigatorType>({ type, scenes,  ...props }: NavigationProps<T>) => {
  const NavigationComponent = Navigators[type] as TNavigators[T]

  return <NavigationComponent.Navigator {...(props as any)}>
    {
      Object.entries(scenes).map(([name, content], idx) => {
        const isFunction = TypeGuards.isFunction(content)

        let screenProps = {
          name,
        } as PropTypes[T]['Screen']

        if (isFunction) {
          screenProps.component = content
        } else {
          screenProps.component = content?.component?.default || content?.component  || content?.default
          const nameParts = name.split('.')
          const title = content?.title || content?.component?.title || nameParts[nameParts.length - 1] || name.replace('.', '')

          screenProps = {
            ...screenProps,
            options: (optionProps) => ({
              title,
              tabBarIcon: (style) => <Icon name={content?.icon} style={style}/>,
              ...(TypeGuards.isFunction(content.options) ? content.options(optionProps)  : content.options),
            }),
          }
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
