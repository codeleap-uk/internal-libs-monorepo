import * as React from 'react'
import * as Animatable from 'react-native-animatable'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  ViewStyles,
  BaseViewProps,
  useCodeleapContext,
  useMemo,
} from '@codeleap/common'
import { View as NativeView } from 'react-native'
import { MotiView, MotiProps } from 'moti'
import { GetKeyboardAwarePropsOptions, useKeyboardAwareView } from '../../utils'

export * from './styles'

export type ViewProps = ComponentPropsWithoutRef<typeof NativeView> &
  ComponentVariants<typeof ViewStyles> & {
    ref?: any
    component?: any
    animated?: boolean
    keyboardAware?: GetKeyboardAwarePropsOptions
  } & BaseViewProps

export const View: React.FC<ViewProps & Partial<MotiProps>> = forwardRef<NativeView, ViewProps & Partial<MotiProps>>((viewProps, ref) => {
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
  const Component = animated ? MotiView : (component || NativeView)
  const keyboard = useKeyboardAwareView()
  const _props = keyboard.getKeyboardAwareProps(
    {
      style: [variantStyles.wrapper, style], ref: ref, ...props,
    },
    {
      adapt: 'paddingBottom',
      baseStyleProp: 'style',

      enabled: false,
      ...keyboardAware,
    },
  )
  return (
    <Component {..._props}>
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
