import { View, ViewProps } from '../View'
import { ElementType, forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  ActivityIndicatorStyles,
  ActivityIndicatorComposition,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { ActivityIndicatorPresets } from './styles'
import { CSSObject } from '@emotion/react'

export * from './styles'

export type ActivityIndicatorProps = {
  styles?: StylesOf<ActivityIndicatorComposition>
  css?: CSSObject
  component?: React.ComponentType<Omit<ActivityIndicatorProps & {ref?: React.Ref<any>}, 'component'>>
} & ComponentVariants<typeof ActivityIndicatorStyles>

export const ActivityIndicator = forwardRef<typeof View, ActivityIndicatorProps>((activityIndicatorProps, ref) => {
  const {
    styles,
    component,
    variants,
    responsiveVariants,
    ...props
  } = {
    ...ActivityIndicator.defaultProps,
    ...activityIndicatorProps,
  }

  const variantStyles = useDefaultComponentStyle<'u:ActivityIndicator', typeof ActivityIndicatorPresets>(
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
        css={variantStyles.wrapper}
        {...props}
      />
    </View>
  )
})

ActivityIndicator.defaultProps = {
  component: View,
}
