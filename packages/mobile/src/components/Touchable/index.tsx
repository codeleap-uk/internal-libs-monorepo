import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  BaseViewProps,

  useCodeleapContext,
  AnyFunction,
  TypeGuards,
  onMount,
} from '@codeleap/common'
import { Pressable, StyleSheet, View as RNView, Platform } from 'react-native'
import { TouchableComposition, TouchablePresets } from './styles'
import { StylesOf } from '../../types'
import { View } from '../View'
import { usePressableFeedback } from '../../utils'
import { Badge, BadgeComposition, BadgeProps } from '../Badge'
import { PressableRipple } from '../../modules/PressableRipple'

export type TouchableProps = React.PropsWithChildren<
  Omit<
    ComponentPropsWithoutRef<typeof Pressable>,
    'onPress'|'children'
  > & {
    variants?: ComponentVariants<typeof TouchablePresets>['variants']
    component?: any
    ref?: React.Ref<RNView>
    debugName: string
    activeOpacity?: number
    debugComponent?: string
    onPress?: AnyFunction
    noFeedback?: boolean
    debounce?: number
    leadingDebounce?: boolean
    styles?: StylesOf<TouchableComposition>
    setPressed?: (param: boolean) => void
    rippleDisabled?: boolean
    badge?: BadgeProps['badge']
    badgeProps?: Partial<BadgeProps>
    badgeStyles?: StylesOf<BadgeComposition>
} & BaseViewProps
>
export * from './styles'

export const Touchable: React.FC<TouchableProps> = forwardRef<
  RNView,
  TouchableProps
>((touchableProps, ref) => {
  const {
    variants = [],
    children,
    onPress,
    style,
    debugName,
    debugComponent,
    debounce = 500,
    leadingDebounce,
    noFeedback = false,
    styles,
    setPressed,
    rippleDisabled = false,
    badge = false,
    badgeProps = {},
    badgeStyles = {},
    ...props
  } = touchableProps

  const pressed = React.useRef(!!leadingDebounce)

  onMount(() => {
    if (!!leadingDebounce && !!debounce) {
      setTimeout(() => {
        pressed.current = false
      }, debounce)
    }
  })

  const variantStyles = useDefaultComponentStyle<'u:Touchable', typeof TouchablePresets>('u:Touchable', {
    variants,
    transform: StyleSheet.flatten,
    rootElement: 'wrapper',
    styles,
  })

  const { logger } = useCodeleapContext()

  const press = () => {
    if (!onPress) {
      logger.warn('No onPress passed to touchable', {
        touchableProps,
      }, 'User Interaction')
      return
    }
    const _onPress = () => {
      logger.log(
        `<${debugComponent || 'Touchable'}/>  pressed`,
        debugName || variants,
        'User interaction',
      )
      onPress && onPress()
    }
    if (TypeGuards.isNumber(debounce)) {
      if (pressed.current) {
        return
      }
      setPressed?.(true)
      pressed.current = true
      _onPress()
      setTimeout(() => {
        setPressed?.(false)
        pressed.current = false
      }, debounce)
    } else {
      _onPress()
    }

  }

  const _styles = StyleSheet.flatten([variantStyles.wrapper, style])

  const disableFeedback = !onPress || noFeedback

  const { rippleConfig, getFeedbackStyle } = usePressableFeedback(_styles, {
    hightlightPropertyIn: 'backgroundColor',
    hightlightPropertyOut: 'backgroundColor',
    disabled: disableFeedback,
    feedbackConfig: variantStyles?.feedback,
  })

  const Wrapper = View

  const { radiusStyle, wrapperStyle, pressableStyle } = React.useMemo(() => {
    const wrapperkeys = [
      'margin',
      'alignSelf',
      'top!',
      'left!',
      'right!',
      'bottom!',
      'position!',
      'transform!',
      // 'flex!',
    ]

    const radiusKey = [
      'Radius#',
    ]

    const sharedKeys = [
      'width!',
      'height!',
      'flex!',
      'backgroundColor!',
    ]

    const wrapperStyle = {} as any
    const pressableStyle = {} as any
    const radiusStyle = {} as any

    const matchKey = (k, key) => {
      if (k.endsWith('#')) {
        return key.includes(k.substring(0, k.length - 1)) 
      } else if (k.endsWith('!')) {
        return key === k.substring(0, k.length - 1)
      } else {
    
        return key.startsWith(k)
      }
    }
    
    Object.entries(_styles).forEach(([key, value]) => {
      if (radiusKey.some(k => matchKey(k, key))) {
        wrapperStyle[key] = value
        pressableStyle[key] = value
        radiusStyle[key] = value
        return
      }

      if (wrapperkeys.some(k => matchKey(k, key))) {
        wrapperStyle[key] = value
      } else if (sharedKeys.some(k => matchKey(k, key))) {
        wrapperStyle[key] = value

        pressableStyle[key] = value
      } else {
        pressableStyle[key] = value
      }
    })
    if (wrapperStyle.position === 'absolute') {
      pressableStyle.width = '100%'
      pressableStyle.height = '100%'
    }

    wrapperStyle.overflow = 'visible'

    return {
      wrapperStyle,
      pressableStyle,
      radiusStyle,
    }
  }, [JSON.stringify(_styles)])

  const disableRipple = disableFeedback || rippleDisabled || Platform.OS !== 'android'

  return (
    <Wrapper style={[wrapperStyle]}>
      {!disableRipple ? (
        <PressableRipple
          onPress={press}  
          style={[
            pressableStyle,
            variantStyles.pressable,
          ]}
          {...props}
          rippleFades={false}
          rippleDuration={400}
          rippleOpacity={0.1}
          {...rippleConfig}
          radiusStyles={radiusStyle}
          // @ts-ignore
          ref={ref}
        >
          {children}
        </PressableRipple>
      ) : (
        <Pressable 
          onPress={press}  
          style={({ pressed }) => ([
            pressableStyle,
            getFeedbackStyle(pressed),
            variantStyles.pressable,
          ])}
          {...props}
          ref={ref}
        >
          {children}
        </Pressable>
      )}

      <Badge {...badgeProps} styles={badgeStyles} badge={badge} />
    </Wrapper>
  )
})
