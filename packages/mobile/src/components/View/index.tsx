import * as React from 'react'
import * as Animatable from 'react-native-animatable'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  ViewStyles,
  BaseViewProps,
  useCodeleapContext,
} from '@codeleap/common'
import { View as NativeView } from 'react-native'
import { MotiView, MotiProps } from 'moti'

export * from './styles'

export type ViewProps = ComponentPropsWithoutRef<typeof NativeView> &
  ComponentVariants<typeof ViewStyles> & {
    ref?: any
    component?: any
    animated?: boolean
  } & BaseViewProps

export const View: React.FC<ViewProps & Partial<MotiProps>> = forwardRef<NativeView, ViewProps & Partial<MotiProps>>((viewProps, ref) => {
  const {
    responsiveVariants = {},
    variants = [],
    children,
    style,

    component,
    animated = false,
    ...props
  } = viewProps

  const variantStyles = useDefaultComponentStyle('View', {
    responsiveVariants,
    variants,
  })
  const Component = animated ? MotiView : (component || NativeView)

  return (
    <Component style={[variantStyles.wrapper, style]} ref={ref} {...props}>
      {children}
    </Component>
  )
})

export const AnimatedView = Animatable.createAnimatableComponent(
  View,
) as unknown as React.ForwardRefExoticComponent<
  { transition?: any; animation?: any } & ViewProps
>

type GapProps = ViewProps & {
  value: number

  defaultProps?: any
}

export const Gap:React.FC<GapProps> = ({ children, value, defaultProps = {}, ...props }) => {
  const { Theme } = useCodeleapContext()
  const horizontal = props.variants?.includes('row')
  return (
    <View {...props}>
      {
        React.Children.toArray(children).map((Element, idx, childArr) => {
          if (React.isValidElement(Element)) {
            const props = { ...Element.props, ...defaultProps }

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
            props.style = [props.style, Theme.spacing[spacingFunction](value / 2)]
            return React.cloneElement(Element, props)
          }
          return Element
        })
      }
    </View>
  )
}
