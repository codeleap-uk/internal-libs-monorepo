import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { ActivityIndicator as Indicator } from 'react-native'
import { ActivityIndicatorComposition, ActivityIndicatorStyles,
  useComponentStyle, ComponentVariants, useStyle } from '@codeleap/common'
import { StylesOf } from '../types/utility'

export type ActivityIndicatorProps =
  ComponentPropsWithoutRef<typeof Indicator> & 
  {
    activity?: string,
    variants?: ComponentVariants <typeof ActivityIndicatorStyles>['variants'],
    styles?: StylesOf<ActivityIndicatorComposition>
  }

export const ActivityIndicator =
  forwardRef<Indicator, ActivityIndicatorProps>((activityIndicatorProps, ref) => {

  const { 
    variants = [], 
    style,
    activity,
    ...props
  } = activityIndicatorProps

  const variantStyles = useComponentStyle('ActivityIndicator', {
    variants
  })

  const { Theme } = useStyle()

  const styles = [variantStyles.wrapper, style]
  const color = Theme.colors.gray

  return (
    <Indicator size={'large'} ref={ref} color={color} style={styles} {...props} />
  )

})