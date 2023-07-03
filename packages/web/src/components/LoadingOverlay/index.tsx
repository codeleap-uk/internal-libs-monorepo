import { ComponentVariants, getNestedStylesByKey, useDefaultComponentStyle } from '@codeleap/common'
import React from 'react'
import { StylesOf } from '../..'
import { LoadingOverlayComposition, LoadingOverlayPresets } from './styles'
import { View, ViewProps } from '../View'
import { ActivityIndicator, ActivityIndicatorProps } from '../ActivityIndicator'
import { ComponentCommonProps } from '../../types/utility'

export type LoadingOverlayProps = Partial<ViewProps<'div'>> & {
  visible?: boolean
  styles?: StylesOf<LoadingOverlayComposition>
  style?: React.CSSProperties
  indicatorProps?: ActivityIndicatorProps
  children?: React.ReactNode
} & ComponentVariants<typeof LoadingOverlayPresets> & ComponentCommonProps

export const LoadingOverlay = (props: LoadingOverlayProps) => {
  const { 
    visible,
    children,
    styles = {},
    variants = [],
    responsiveVariants = {},
    style = {},
    indicatorProps,
    debugName,
    ...rest 
  } = props

  const variantStyles = useDefaultComponentStyle<'u:LoadingOverlay', typeof LoadingOverlayPresets>('u:LoadingOverlay', {
    variants, 
    styles, 
    responsiveVariants, 
    rootElement: 'wrapper',
  })

  const indicatorStyles = React.useMemo(() => {
    return getNestedStylesByKey('indicator', variantStyles)
  }, [variantStyles])

  return (
    <View css={[variantStyles.wrapper, visible && variantStyles['wrapper:visible'], style]} {...rest}>
      <ActivityIndicator debugName={debugName} {...indicatorProps} styles={indicatorStyles} />
      {children}
    </View>
  )
}

export * from './styles'
