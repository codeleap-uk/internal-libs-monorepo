import { ComponentVariants, useDefaultComponentStyle } from '@codeleap/common'
import React from 'react'
import { StylesOf } from '../..'
import { LoadingOverlayComposition, LoadingOverlayPresets } from './styles'
import { View } from '../View'
import { ActivityIndicator } from '../ActivityIndicator'

export type LoadingOverlayProps = React.PropsWithChildren<{
  visible?: boolean
  styles?: StylesOf<LoadingOverlayComposition>
}> & ComponentVariants<typeof LoadingOverlayPresets>

export const LoadingOverlay = (props: LoadingOverlayProps) => {
  const { visible, children, styles, variants, responsiveVariants } = props

  const variantStyles = useDefaultComponentStyle<'u:LoadingOverlay', typeof LoadingOverlayPresets>('u:LoadingOverlay', {
    variants, styles, responsiveVariants, rootElement: 'wrapper',
  })

  return <View css={[variantStyles.wrapper, visible && variantStyles['wrapper:visible']]}>
    <ActivityIndicator/>
    {children}
  </View>
}

export * from './styles'
