import { onMount } from '@codeleap/hooks'
import { TypeGuards } from '@codeleap/types'
import React, { ComponentType, ElementType, forwardRef, HTMLAttributes } from 'react'
import { stopPropagation } from '../../lib'
import { getTestId } from '../../lib/utils/test'
import { TouchableProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { logger } from '@codeleap/logger'

export * from './styles'
export * from './types'

export const Touchable = (touchableProps: TouchableProps) => {
  const allProps = {
    ...Touchable.defaultProps,
    ...touchableProps,
  }

  const {
    propagate,
    debounce,
    leadingDebounce,
    setPressed,
    component,
    disabled,
    onPress,
    onClick,
    debugName,
    debugComponent,
    style,
    analyticsEnabled,
    analyticsName,
    analyticsData,
    ref,
    ...props
  } = allProps

  const styles = useStylesFor(Touchable.styleRegistryName, style)

  const pressed = React.useRef(!!leadingDebounce)

  onMount(() => {
    if (!!leadingDebounce && !!debounce) {
      setTimeout(() => {
        pressed.current = false
      }, debounce)
    }
  })

  const Component: any = component as unknown as ComponentType<HTMLAttributes<HTMLButtonElement>>

  const notPressable = !TypeGuards.isFunction(onPress) && !TypeGuards.isFunction(onClick)

  const handleClick = (event) => {
    if (disabled) return

    if (!propagate) stopPropagation(event)

    if (notPressable) return

    const _onPress = () => {
      if (event && (event?.type !== 'click' && event?.keyCode !== 13 && event?.key !== 'Enter')) return null

      logger.log(
        `<${debugComponent || 'Touchable'}/> pressed:`,
        { debugName, debugComponent },
      )

      // if (analyticsEnabled) {
      //   const name = analyticsName || debugName
      //   if (!!name?.trim?.()) {
      //     logger.analytics?.interaction(name, analyticsData)
      //   }
      // }

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

  const testId = getTestId(allProps)

  return (
    <Component
      {...props}
      onClick={handleClick}
      onKeyDown={handleClick}
      ref={ref}
      css={[styles.wrapper, disabled && styles['wrapper:disabled']]}
      data-testid={testId}
    />
  )
}

Touchable.styleRegistryName = 'Touchable'
Touchable.elements = ['wrapper']
Touchable.rootElement = 'wrapper'

Touchable.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Touchable as <T extends ElementType = 'button'>(props: StyledComponentProps<TouchableProps<T>, typeof styles>) => IJSX
}

Touchable.defaultProps = {
  propagate: true,
  debounce: null,
  component: 'div',
  analyticsEnabled: false,
  analyticsName: null,
  analyticsData: {},
  tabIndex: 0,
} as Partial<TouchableProps>

WebStyleRegistry.registerComponent(Touchable)
