import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { ActivityIndicator as Indicator, StyleSheet } from 'react-native'
import {
  ActivityIndicatorComposition,
  ActivityIndicatorStyles,
  useDefaultComponentStyle,
  ComponentVariants,
  useCodeleapContext,
} from '@codeleap/common'
import { StylesOf } from '../types/utility'

export type ActivityIndicatorProps = ComponentPropsWithoutRef<
  typeof Indicator
> & {
  variants?: ComponentVariants<typeof ActivityIndicatorStyles>['variants'];
  styles?: StylesOf<ActivityIndicatorComposition>;
};

export const ActivityIndicator = forwardRef<Indicator, ActivityIndicatorProps>(
  (activityIndicatorProps, ref) => {
    const { variants = [], style, styles: propStyles, ...props } = activityIndicatorProps

    const variantStyles = useDefaultComponentStyle('ActivityIndicator', {
      variants,
      transform: StyleSheet.flatten,
      styles: propStyles,
    })

    const { Theme } = useCodeleapContext()

    const color = variantStyles.wrapper?.color || Theme.colors.gray
    const size = variantStyles.wrapper?.height || variantStyles.wrapper?.width || 'large'

    const styles = StyleSheet.flatten([variantStyles.wrapper, style])

    return (
      <Indicator
        size={size}
        ref={ref}
        color={color}
        style={styles}
        {...props}
      />
    )
  },
)
