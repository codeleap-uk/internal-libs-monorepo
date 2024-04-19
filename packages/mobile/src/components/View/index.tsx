import React from 'react'
import { View as RNView } from 'react-native'
import { AnyRecord, IJSX, StyledComponentProps, themeStore } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { TypeGuards } from '@codeleap/common'
import Animated from 'react-native-reanimated'
import { ViewProps } from './types'

export * from './types'
export * from './styles'

export const View = <T extends React.ComponentType = typeof RNView>(props: ViewProps<T>) => {
  const { 
    style, 
    component: _Component = RNView,
    animated = false,
    ...viewProps
  } = props

  const styles = MobileStyleRegistry.current.styleFor(View.styleRegistryName, style)

  const Component: React.ComponentType<any> = animated ? Animated.View : _Component

  return (
    <Component {...viewProps} style={styles.wrapper} />
  )
}

View.styleRegistryName = 'View'
View.elements = ['wrapper']
View.rootElement = 'wrapper'

View.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return View as (<T extends React.ComponentType = typeof RNView>(props: StyledComponentProps<ViewProps<T>, typeof styles>) => IJSX)
}

MobileStyleRegistry.registerComponent(View)

type GapProps = ViewProps & {
  value: number
  crossValue?: number
  defaultProps?: any
}

export const Gap = ({ children, value, defaultProps = {}, crossValue = null, ...props }: GapProps) => {
  const theme = themeStore(store => store.current)
  const childArr = React.Children.toArray(children)

  const horizontal = false

  const spacings = React.useMemo(() => {
    return childArr.map((_, idx) => {

      // @ts-expect-error
      const space = theme?.spacing?.value?.(value)
      // @ts-expect-error
      const crossSpace = theme?.spacing?.value?.(crossValue)

      const isLast = idx === childArr.length - 1

      const spacingProperty = horizontal ? 'marginRight' : 'marginBottom'
      const crossSpacingProperty = horizontal ? 'marginBottom' : 'marginRight'

      const style = isLast ? {} : {
        [spacingProperty]: space,
      }

      if (!TypeGuards.isNil(crossValue)) {
        style[crossSpacingProperty] = crossSpace
      }

      return style
    })

  }, [childArr.length, horizontal])

  return (
    <View {...props}>
      {
        childArr.map((Element, idx, childArr) => {
          if (React.isValidElement(Element)) {
            const props = { ...Element.props, ...defaultProps }

            props.style = [props.style, spacings[idx]]
            return React.cloneElement(Element, props)
          }
          return Element
        })
      }
    </View>
  )
}
