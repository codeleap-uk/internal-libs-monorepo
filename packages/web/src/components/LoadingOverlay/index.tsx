import { ComponentVariants, getNestedStylesByKey, useDefaultComponentStyle } from '@codeleap/common'
import React from 'react'
import { StylesOf } from '../..'
import { LoadingOverlayComposition, LoadingOverlayPresets } from './styles'
import { View } from '../View'
import { ActivityIndicator, ActivityIndicatorProps } from '../ActivityIndicator'

export type LoadingOverlayProps = React.PropsWithChildren<{
  visible?: boolean
  styles?: StylesOf<LoadingOverlayComposition>
  indicatorProps?: ActivityIndicatorProps
}> & ComponentVariants<typeof LoadingOverlayPresets>

export const LoadingOverlay = (props: LoadingOverlayProps) => {
  const { visible, children, styles, variants, responsiveVariants, indicatorProps } = props

  const variantStyles = useDefaultComponentStyle<'u:LoadingOverlay', typeof LoadingOverlayPresets>('u:LoadingOverlay', {
    variants, styles, responsiveVariants, rootElement: 'wrapper',
  })

  const indicatorStyles = getNestedStylesByKey('indicator', variantStyles)

  return (
    <View css={[variantStyles.wrapper, visible && variantStyles['wrapper:visible']]}>
      <ActivityIndicator styles={indicatorStyles} {...indicatorProps} />
      {children}
    </View>
  )
}

export * from './styles'
