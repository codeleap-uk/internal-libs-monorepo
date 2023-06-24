import { AnyFunction, ComponentVariants, onMount, TypeGuards, useCodeleapContext, useDefaultComponentStyle } from '@codeleap/common'
import React, { ComponentPropsWithRef, ElementType, forwardRef, ReactElement } from 'react'
import { stopPropagation } from '../../lib'
import { View } from '../View'
import { TouchableComposition, TouchablePresets } from './styles'
import { StylesOf } from '../../types'
import { CSSInterpolation } from '@emotion/css'

export * from './styles'

export type TouchableProps<T extends ElementType = 'button'> = ComponentPropsWithRef<T> & {
  css?: CSSInterpolation | CSSInterpolation[]
  component?: T
  disabled?: boolean
  propagate?: boolean
  onPress?: AnyFunction
  debugName?: string
  debugComponent?: string
  styles?: StylesOf<TouchableComposition>
  debounce?: number
  leadingDebounce?: boolean
  setPressed?: (param: boolean) => void
} & ComponentVariants<typeof TouchablePresets>

export const TouchableCP = <T extends ElementType = typeof View>(
  touchableProps: TouchableProps<T>,
  ref,
) => {
  const {
    children,
    propagate = true,
    debounce = null,
    leadingDebounce,
    setPressed,
    component: Component = View,
    disabled,
    onPress,
    onClick,
    debugName,
    debugComponent,
    style = {},
    styles = {},
    responsiveVariants = {},
    variants = [],
    css = [],
    ...props
  } = touchableProps as TouchableProps

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
    rootElement: 'wrapper'
  })

  const { logger } = useCodeleapContext()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disabled) return

    if (!propagate) stopPropagation(event)

    if (!TypeGuards.isFunction(onPress)) { 
      logger.warn(
        'No onPress passed to touchable', 
        touchableProps, 
        'User interaction'
      )
      return
    }

    const _onPress = () => {
      logger.log(
        `<${debugComponent || 'Touchable'}/> pressed`, 
        { debugName }, 
        'User interaction'
      )
      
      if(TypeGuards.isFunction(onClick)) onClick?.(event)
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
  ]), [variantStyles, disabled])

  return (
    <View
      component={Component || 'div'} 
      {...props} 
      onClick={handleClick} 
      ref={ref}
      css={_styles}
    >
      {children}
    </View>
  )
}

export const Touchable = forwardRef(TouchableCP) as <T extends ElementType = typeof View>(
  touchableProps: TouchableProps<T>
) => ReactElement
