import React from 'react'
import { View as RNView } from 'react-native'
import { AnyRecord, IJSX, StyledComponentProps, useTheme } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { TypeGuards } from '@codeleap/common'
import Animated from 'react-native-reanimated'
import { ViewProps } from './types'
import { useStylesFor } from '../../hooks'

export * from './types'
export * from './styles'

export const View = <T extends React.ComponentType = typeof RNView>(props: ViewProps<T>) => {
  const { 
    style, 
    component: _Component = RNView,
    animated = false,
    animatedStyle,
    ...viewProps
  } = props

  const styles = useStylesFor(View.styleRegistryName, style)

  const Component: React.ComponentType<any> = animated ? Animated.View : _Component

  return (
    <Component {...viewProps} style={[styles.wrapper, animatedStyle]} />
  )
}

View.styleRegistryName = 'View'
View.elements = ['wrapper']
View.rootElement = 'wrapper'

View.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return View as (<T extends React.ComponentType = typeof RNView>(props: StyledComponentProps<ViewProps<T>, typeof styles>) => IJSX)
}

MobileStyleRegistry.registerComponent(View)

type GapProps = Omit<ViewProps, 'style'> & {
  value: number
  crossValue?: number
  defaultProps?: any
  style?: any
}

export const Gap = ({ children, value, defaultProps = {}, crossValue = null, ...props }: GapProps) => {
  // @ts-expect-error
  const themeSpacing = useTheme(store => store.current?.spacing)
  const childArr = React.Children.toArray(children)

  const horizontal = React.useMemo(() => {
    if (Array.isArray(props?.style)) {
      return props?.style?.includes('row')
    } else if (typeof props?.style == 'object') {
      // @ts-ignore
      return props?.style?.flexDirection == 'row'
    }

    return false
  }, [])

  const spacings = React.useMemo(() => {
    return childArr.map((_, idx) => {

      const space = themeSpacing?.value?.(value)
      const crossSpace = themeSpacing?.value?.(crossValue)

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

            if (Array.isArray(props?.style)) {
              props.style = [...props.style, spacings[idx]]
            } else {
              props.style = [props.style, spacings[idx]]
            }

            return React.cloneElement(Element, props)
          }
          return Element
        })
      }
    </View>
  )
}
