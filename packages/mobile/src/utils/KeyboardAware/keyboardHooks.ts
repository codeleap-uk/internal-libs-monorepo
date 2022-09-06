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
}
export const useKeyboardAwareView = (params?: UseKeyboardAwareViewParams) => {
  const keyboard = useKeyboard()
  const { logger } = useCodeleapContext()
  function getKeyboardAwareProps<T extends ScrollViewProps>(
    props?:T,
    options?: GetKeyboardAwarePropsOptions,
  ): T {

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

    if (!_options.enabled || props?.horizontal || (Platform.OS === 'android' && !_options.enableOnAndroid)) return props

    if (!props) {
      props = {} as T
    }
    const baseStyle = StyleSheet.flatten(props[_options.baseStyleProp] || {})

    const baseValue = baseStyle[_options.adapt] as number
    let valid = true
    const warnOnNotNumber = () => {
      if (!TypeGuards.isNil(baseValue) && !TypeGuards.isNumber(baseValue)) {
        valid = false
        const debugStr = params?.debugName ? 'at ' + params?.debugName + ' ' : ''
        logger.warn(
          `${_options.baseStyleProp}.${_options.adapt} must be a number or not be set at all`,
          { props, options: _options },
          'useKeyboardAwareView' + debugStr,
        )
      }
    }

    const newStyleProp = _options.animated ? {

    } : {
      ...baseStyle,
    }

    switch (_options.adapt) {
      case 'height':
        warnOnNotNumber()
        const baseHeight = baseValue || 0
        newStyleProp.height = baseHeight - keyboard.height
        break
      case 'maxHeight':
        if (keyboard.isVisible) {
          warnOnNotNumber()
          const baseMaxHeight = baseValue || Dimensions.get('window').height
          newStyleProp.maxHeight = baseMaxHeight - keyboard.height
          // break
        }
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

    if (!valid) return props

    const _return = {
      ...props,
      [_options?.animated ? 'animate' : _options.baseStyleProp]: newStyleProp,
    }

    if (_options.animated && !!_options?.transition) {
      _return.transition = JSON.parse(JSON.stringify({
        [_options.adapt]: _options.transition,
      }))
    }

    return _return
  }
  return {
    keyboard,
    getKeyboardAwareProps,
  }
}
