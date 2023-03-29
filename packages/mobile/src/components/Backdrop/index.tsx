import React from 'react'
import { ComponentVariants, onUpdate, PropsOf, useDefaultComponentStyle } from '@codeleap/common'
import { useDynamicAnimation } from 'moti'
import { Touchable } from '../Touchable'
import { View } from '../View'

import { StylesOf } from '../../types/utility'
import { StyleSheet } from 'react-native'
import { useStaticAnimationStyles } from '../../utils'
import { BackdropComposition, BackdropPresets } from './styles'

export * from './styles'
export type BackdropProps = React.PropsWithChildren<

  PropsOf<typeof Touchable> & {
    visible: boolean
    wrapperProps?: PropsOf<typeof View>
    variants?: ComponentVariants<typeof BackdropPresets>['variants']
    styles?: StylesOf<BackdropComposition>
}>

export const Backdrop = (backdropProps:BackdropProps) => {
  const { variants = [], styles = {}, visible, children, wrapperProps = {}, ...props } = backdropProps

  const variantStyles = useDefaultComponentStyle<'u:Backdrop', typeof BackdropPresets>('u:Backdrop', {
    variants,
    rootElement: 'wrapper',
    styles,
    transform: StyleSheet.flatten,
  })

  const animationStates = useStaticAnimationStyles(variantStyles, ['wrapper:hidden', 'wrapper:visible'])

  const animation = useDynamicAnimation(() => {
    return visible ? animationStates['wrapper:visible'] : animationStates['wrapper:hidden']
  })

  onUpdate(() => {
    animation.animateTo(visible ? animationStates['wrapper:visible'] : animationStates['wrapper:hidden'])
  }, [visible, animationStates])

  return <View pointerEvents={visible ? 'auto' : 'none' } animated style={variantStyles.wrapper} state={animation} {...wrapperProps}>
    {
      !!props?.onPress ?
        <Touchable style={variantStyles.touchable} {...props} noFeedback android_ripple={null}/>
        : null
    }
    {children}
  </View>
}
