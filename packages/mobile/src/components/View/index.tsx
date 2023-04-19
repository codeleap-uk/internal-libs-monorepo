import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  ViewStyles,
  BaseViewProps,
  useCodeleapContext,
  useMemo,
} from '@codeleap/common'
import { View as NativeView, ViewProps as RNViewProps } from 'react-native'
import { GetKeyboardAwarePropsOptions, useKeyboardAwareView } from '../../utils'
import {TransitionConfig} from '../../types'
import Animated from 'react-native-reanimated'
export * from './styles'



type NativeViewProps =Omit<ComponentPropsWithoutRef<typeof NativeView>, 'children'>

export type ViewRefType = NativeView | React.ForwardedRef<NativeView>
export type ViewProps = React.PropsWithChildren<{
  ref?: ViewRefType
  component?: any
  animated?: boolean
  keyboardAware?: GetKeyboardAwarePropsOptions
  transition?: Partial<TransitionConfig>
} &
  NativeViewProps & ComponentVariants<typeof ViewStyles>   & BaseViewProps
>


export const View  = forwardRef<NativeView,ViewProps>((viewProps, ref) => {
  const {
    responsiveVariants = {},
    variants = [],
    children,
    style,
    keyboardAware,
    component,
    animated = false,
    ...props
  } = viewProps

  const variantStyles = useDefaultComponentStyle('View', {
    responsiveVariants,
    variants,
  })
  const Component = animated ? Animated.View  : component || NativeView

  return (
    <Component  {...props} style={[variantStyles.wrapper, style]}>
      {children}
    </Component>
  )
}) as unknown as React.FC<ViewProps>


type GapProps = ViewProps & {
  value: number

  defaultProps?: any
}

export const Gap:React.FC<React.PropsWithChildren<GapProps>> = ({ children, value, defaultProps = {}, ...props }) => {
  const { Theme } = useCodeleapContext()
  const childArr = React.Children.toArray(children)

  const horizontal = props.variants?.includes('row')
  const spacings = useMemo(() => {
    return childArr.map((_, idx) => {
      let spacingFunction = horizontal ? 'marginHorizontal' : 'marginVertical'

      switch (idx) {
        case 0:
          spacingFunction = horizontal ? 'marginRight' : 'marginBottom'
          break
        case childArr.length - 1:
          spacingFunction = horizontal ? 'marginLeft' : 'marginTop'
          break
        default:
          break
      }

      return Theme.spacing[spacingFunction](value / 2)
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
