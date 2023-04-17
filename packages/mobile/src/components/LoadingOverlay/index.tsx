import React, { useRef } from 'react'
import { ComponentVariants, getNestedStylesByKey, onUpdate, useDefaultComponentStyle, useMemo } from '@codeleap/common'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types'
import { ActivityIndicator } from '../ActivityIndicator'
import { View } from '../View'
import { LoadingOverlayComposition, LoadingOverlayPresets } from './styles'
import { useAnimatedVariantStyles } from '../../utils'

export * from './styles'

export type LoadingOverlayProps = React.PropsWithChildren<{
    variants?: ComponentVariants<typeof LoadingOverlayPresets>['variants']
    styles?: StylesOf<LoadingOverlayComposition>
    visible?: boolean
} >

export const LoadingOverlay = (props: LoadingOverlayProps) => {
  const {
    children,
    styles,
    variants,
    visible,
  } = props

  const variantStyles = useDefaultComponentStyle<'u:LoadingOverlay', typeof LoadingOverlayPresets>('u:LoadingOverlay', {
    variants,
    rootElement: 'wrapper',
    styles,
    transform: StyleSheet.flatten,
  })

  const loaderStyles = useMemo(() => getNestedStylesByKey('loader', variantStyles), [variantStyles])

  const wrapperAnimation = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: ['wrapper:visible', 'wrapper:hidden'],
    updater: (s) => {
      'worklet'
      return visible ? s['wrapper:visible'] : s['wrapper:hidden']
    },
    transition: variantStyles.transition,
    dependencies: [visible],
  })
 

  const transition = useRef(null)
  if (!transition.current) {
    transition.current = JSON.parse(JSON.stringify(variantStyles['wrapper:transition']))
  }
  return <View style={[variantStyles.wrapper, wrapperAnimation]} animated  transition={transition.current}>
    <ActivityIndicator styles={loaderStyles}/>
    {children}
  </View>
}
