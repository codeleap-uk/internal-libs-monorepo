import { AnyFunction, ComponentVariants, onMount, TypeGuards, useCodeleapContext, useDefaultComponentStyle } from '@codeleap/common'
import React, { ComponentPropsWithRef, ElementType, forwardRef } from 'react'
import { stopPropagation } from '../../lib'
import { View } from '../View'
import { TouchableComposition, TouchablePresets } from './styles'
import { CSSInterpolation } from '@emotion/css'
import { StylesOf, NativeHTMLElement } from '../../types'

export * from './styles'

export type TouchableProps<T extends ElementType = 'button'> = ComponentPropsWithRef<T> & {
  css?: CSSInterpolation | CSSInterpolation[]
  component?: T
  disabled?: boolean
  propagate?: boolean
  style?: React.CSSProperties
  onPress?: AnyFunction
  debugName: string
  debugComponent?: string
  styles?: StylesOf<TouchableComposition>
  debounce?: number
  leadingDebounce?: boolean
  setPressed?: (pressed: boolean) => void
  analyticsEnabled?: boolean
  analyticsName?: string
  analyticsData?: Record<string, any>
} & ComponentVariants<typeof TouchablePresets>

const defaultProps: Partial<TouchableProps<'button'>> = {
  propagate: true,
  debounce: null,
  component: View as unknown as 'button',
  style: {},
  styles: {},
  responsiveVariants: {},
  variants: [],
  css: [],
  analyticsEnabled: false,
  analyticsName: null,
  analyticsData: {},
  tabIndex: 0,
}
export const TouchableCP = <T extends NativeHTMLElement = 'button'>(
  touchableProps: TouchableProps<T>,
  ref,
) => {
  const mergedProps = {
    ...(defaultProps),
    ...(touchableProps),
  }
  const {
    propagate,
    debounce,
    leadingDebounce,
    setPressed,
    component: Component,
    disabled,
    onPress,
    onClick,
    debugName,
    debugComponent,
    style,
    styles,
    responsiveVariants,
    variants,
    css,
    analyticsEnabled,
    analyticsName,
    analyticsData,
    ...props
  } = mergedProps

  const pressed = React.useRef(!!leadingDebounce)

  onMount(() => {
    if (!!leadingDebounce && !!debounce) {
      setTimeout(() => {
        pressed.current = false
      }, debounce)
    }
  })

  const variantStyles = useDefaultComponentStyle<'u:Touchable', typeof TouchablePresets>('u:Touchable', {
    responsiveVariants,
    variants,
    styles,
    rootElement: 'wrapper',
  })

  const { logger } = useCodeleapContext()

  const notPressable = !TypeGuards.isFunction(onPress) && !TypeGuards.isFunction(onClick)

  const handleClick = (event) => {
    if (disabled) return

    if (!propagate) stopPropagation(event)

    if (notPressable) {
      logger.warn(
        'No onPress passed to touchable',
        touchableProps,
        'User interaction',
      )
      return
    }

    const _onPress = () => {
      if (event && (event?.type !== 'click' && event?.keyCode !== 13 && event?.key !== 'Enter')) return null

      logger.log(
        `<${debugComponent || 'Touchable'}/> pressed`,
        { debugName, debugComponent },
        'User interaction',
      )
      if (analyticsEnabled) {
        const name = analyticsName || debugName
        if (!!name?.trim?.()) {
          logger.analytics?.interaction(name, analyticsData)
        }
      }

      if (TypeGuards.isFunction(onClick)) onClick?.(event)
      onPress?.()
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

  const _styles = React.useMemo(() => ([
    variantStyles.wrapper,
    disabled && variantStyles['wrapper:disabled'],
    css,
    style,
  ]), [variantStyles, disabled, style])

  return (
    // @ts-ignore
    <View
      component={Component || 'button'}
      {...props}
      debugName={debugName}
      onClick={handleClick}
      onKeyDown={handleClick}
      ref={ref}
      css={_styles}
    />
  )
}

export const Touchable = forwardRef(TouchableCP) as (<T extends NativeHTMLElement = 'button'>(
  touchableProps: TouchableProps<T>
) => JSX.Element) & {
  defaultProps: Partial<TouchableProps<'button'>>
}

Touchable.defaultProps = defaultProps
