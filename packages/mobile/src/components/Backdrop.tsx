import React from 'react'
import { ComponentVariants, onUpdate, PropsOf, useDefaultComponentStyle } from '@codeleap/common'
import { useAnimationState, useDynamicAnimation } from 'moti'
import { Touchable } from './Touchable'
import { View } from './View'
import {
  createDefaultVariantFactory,
  includePresets,
} from '@codeleap/common'
import { StylesOf } from '../types/utility'
import { StyleSheet } from 'react-native'
import { useStaticAnimationStyles } from '../utils/hooks'

type BackdropComposition =
 'wrapper'|
'touchable' |
'wrapper:visible' |
'wrapper:hidden'

const createBackdropVariant = createDefaultVariantFactory<BackdropComposition>()

const presets = includePresets((style) => createBackdropVariant(() => ({ wrapper: style })))

export const BackdropStyles = {
  ...presets,
  default: createBackdropVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.black,
      ...theme.presets.whole,
      ...theme.presets.absolute,
    },
    'wrapper:visible': {
      opacity: 0.5,
    },
    'wrapper:hidden': {

      opacity: 0,
    },
    touchable: {
      ...theme.presets.whole,
      ...theme.presets.absolute,
    },
  })),
}

export type BackdropProps = PropsOf<typeof Touchable> & {
    visible: boolean
    wrapperProps?: PropsOf<typeof View>
    variants?: ComponentVariants<typeof BackdropStyles>['variants']
    styles?: StylesOf<BackdropComposition>
}

export const Backdrop = (backdropProps:BackdropProps) => {
  const { variants = [], styles = {}, visible, children, wrapperProps = {}, ...props } = backdropProps

  const variantStyles = useDefaultComponentStyle<'u:Backdrop', typeof BackdropStyles>('u:Backdrop', {
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
      props?.onPress ?
        <Touchable feedbackVariant='none' style={variantStyles.touchable} {...props} />
        : null
    }
    {children}
  </View>
}
