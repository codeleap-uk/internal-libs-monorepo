import * as React from 'react'
import { forwardRef } from 'react'
import { ActivityIndicator as Indicator, ActivityIndicatorProps as IndicatorProps, StyleSheet } from 'react-native'
import {

  useDefaultComponentStyle,
  ComponentVariants,
  useCodeleapContext,
} from '@codeleap/common'
import { StylesOf } from '../../types'
import {
  ActivityIndicatorComposition,
  ActivityIndicatorPresets,
} from './styles'

export * from './styles'
export type ActivityIndicatorProps =
  IndicatorProps
 & {
  variants?: ComponentVariants<typeof ActivityIndicatorPresets>['variants']
  styles?: StylesOf<ActivityIndicatorComposition>
  component?: React.ComponentType<Omit<ActivityIndicatorProps & {ref?: React.Ref<Indicator>}, 'component'>>
}

export const ActivityIndicator = forwardRef<Indicator, ActivityIndicatorProps>(
  (activityIndicatorProps, ref) => {
    const {
      variants = [],
      style = {},
      styles: propStyles = {},
      component = Indicator,
      ...props
    } = {
      ...ActivityIndicator.defaultProps,
      ...activityIndicatorProps,

    }

    const variantStyles = useDefaultComponentStyle('ActivityIndicator', {
      variants,
      transform: StyleSheet.flatten,
      styles: propStyles,
    })

    const { Theme } = useCodeleapContext()

    const styles = StyleSheet.flatten([variantStyles.wrapper, style])
    const color = styles?.color || Theme.colors.gray
    const size = styles?.height || styles?.width || 'large'

    const Component = component

    return (
      <Component
        size={size}
        ref={ref}
        color={color}
        style={styles}
        styles={styles}
        {...props}
      />
    )
  },
)

ActivityIndicator.defaultProps = {
  component: Indicator,
}
