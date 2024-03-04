import { PropsOf, useCodeleapContext, TypeGuards } from '@codeleap/common'
import { ScrollView, Platform, StyleSheet, Dimensions, EasingFunction, Easing } from 'react-native'
import { TransitionConfig } from '../../types'
import { useKeyboard } from './context'
type ScrollViewProps = Partial<
  Pick<
  PropsOf<typeof ScrollView>,
  'horizontal' | 'contentContainerStyle' | 'style'
  >
> & {
  transition?: TransitionConfig
}

export type GetKeyboardAwarePropsOptions = {
  baseStyleProp?: 'style' | 'contentContainerStyle'
  adapt?: 'height' | 'maxHeight' | 'paddingBottom' | 'marginBottom' | 'bottom'
  enabled?: boolean
  animated?: boolean
  transition?: TransitionConfig
  enableOnAndroid?: boolean
}
type UseKeyboardAwareViewParams = {
  debugName?: string
  styles?: any
} & GetKeyboardAwarePropsOptions

export const useKeyboardAwareView = (params?: UseKeyboardAwareViewParams) => {
  const keyboard = useKeyboard()
  const { logger } = useCodeleapContext()
  const options = params || {}

  const _options:GetKeyboardAwarePropsOptions = {
    adapt: 'maxHeight',
    baseStyleProp: 'style',
    enabled: true,
    enableOnAndroid: false,
    animated: false,
    ...options,
    transition: {
      easing: Easing.linear,
      duration: 200,
      type: 'timing',
    },
  }

  if (!_options.enabled || (Platform.OS === 'android' && !_options.enableOnAndroid)) {
    return {
      keyboard,
      style: params?.styles,
    }
  }

  const baseStyle = StyleSheet.flatten(params.styles || {})

  let baseValue = baseStyle[_options.adapt] as number

  if (TypeGuards.isNil(baseValue)) {
    baseValue = 0
  }

  let valid = true
  const warnOnNotNumber = () => {
    if (!TypeGuards.isNil(baseValue) && !TypeGuards.isNumber(baseValue)) {
      valid = false
      const debugStr = params?.debugName ? 'at ' + params?.debugName + ' ' : ''
      console.log(debugStr)
    }
  }

  let newStyleProp = {
    ...baseStyle,
  }

  switch (_options.adapt) {
    case 'height':
      warnOnNotNumber()
      const baseHeight = baseValue || 0
      newStyleProp.height = baseHeight - keyboard.height
      break
    case 'maxHeight':
      warnOnNotNumber()
      const baseMaxHeight = baseValue || Dimensions.get('window').height
      newStyleProp.maxHeight = baseMaxHeight - keyboard.height
      break
    case 'paddingBottom':
      warnOnNotNumber()
      const basePaddingBottom = baseValue || 0
      newStyleProp.paddingBottom = basePaddingBottom + keyboard.height
      break
    case 'marginBottom':
      warnOnNotNumber()
      const baseMarginBottom = baseValue || 0
      newStyleProp.marginBottom = baseMarginBottom + keyboard.height
      break
    case 'bottom':
      warnOnNotNumber()
      const baseBottom = baseValue || 0
      newStyleProp.bottom = baseBottom + keyboard.height
      break
  }

  if (!valid) {
    newStyleProp = params.styles
  }

  return {
    keyboard,
    style: newStyleProp,

  }
}
