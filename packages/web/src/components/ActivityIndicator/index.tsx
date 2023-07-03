import { View } from '../View'
import React from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  ActivityIndicatorStyles,
  ActivityIndicatorComposition,
  StylesOf,
  TypeGuards,
} from '@codeleap/common'
import { ActivityIndicatorPresets } from './styles'
import { CSSInterpolation } from '@emotion/css'
import { ComponentCommonProps, ComponentWithDefaultProps } from '../../types'

export * from './styles'

export type ActivityIndicatorProps = ComponentCommonProps & {
  style?: React.CSSProperties
  styles?: StylesOf<ActivityIndicatorComposition>
  css?: CSSInterpolation | CSSInterpolation[]
  component?: React.ComponentType<Omit<ActivityIndicatorProps & {ref?: React.Ref<any>}, 'component'>>
  size?: number
} & ComponentVariants<typeof ActivityIndicatorStyles>

export const ActivityIndicator = React.forwardRef<typeof View, ActivityIndicatorProps>((activityIndicatorProps, ref) => {
  const allProps = {
    ...ActivityIndicator.defaultProps,
    ...activityIndicatorProps,
  }

  const {
    style = {},
    styles = {},
    component: Component,
    variants = [],
    responsiveVariants = {},
    size,
    ...props
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:ActivityIndicator', typeof ActivityIndicatorPresets>(
    'u:ActivityIndicator',
    {
      responsiveVariants,
      variants,
      styles,
      rootElement: 'wrapper',
    },
  )

  const _size = React.useMemo(() => {
    return TypeGuards.isNumber(size) ? {
      width: size,
      height: size,
    } : {}
  }, [size])

  return (
    <View css={[variantStyles.wrapper, _size, style]}>
      <Component
        ref={ref}
        css={[variantStyles.wrapper, _size, style]}
        {...props}
      />
    </View>
  )
}) as ComponentWithDefaultProps<ActivityIndicatorProps>

ActivityIndicator.defaultProps = {
  component: View,
  size: null,
}
