import { View, ViewProps } from '../View'
import { ElementType, forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  ActivityIndicatorStyles,
  ActivityIndicatorComposition,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { ActivityIndicatorTestPresets } from './styles'

export * from './styles'

export type ActivityIndicatorTestProps<T extends ElementType = any> = ComponentVariants & ViewProps<T> &{
  // animating?: boolean
  // hidesWhenStopped?: boolean
  styles?: StylesOf<ActivityIndicatorComposition>
  component?: React.ComponentType<Omit<ActivityIndicatorTestProps & {ref?: React.Ref<typeof View>}, 'component'>>
  // css?: CSSObject
  // size?: number
} & ComponentVariants<typeof ActivityIndicatorStyles>

export const ActivityIndicatorTest = forwardRef<typeof View, ActivityIndicatorTestProps>((props, ref) => {
  const {
    // animating = true,
    // hidesWhenStopped = true,
    component,
    styles,
    variants,
    responsiveVariants,
  } = props

  const variantStyles = useDefaultComponentStyle<'u:ActivityIndicator', typeof ActivityIndicatorTestPresets>(
    'u:ActivityIndicator',
    {
      variants,
      styles,
      responsiveVariants,
    },
  )

  const Component = component

  return (
    <View
      style={variantStyles.wrapper}
    >
      <Component
        ref={ref}
        {...props}
        css={variantStyles.wrapper}
      />
    </View>
  )
})

ActivityIndicatorTest.defaultProps = {
  component: View,
}
