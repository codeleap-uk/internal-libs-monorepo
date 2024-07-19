import { onMount, TypeGuards } from '@codeleap/common'
import React, { forwardRef } from 'react'
import { stopPropagation } from '../../lib'
import { View } from '../View'
import { NativeHTMLElement } from '../../types'
import { getTestId } from '../../lib/utils/test'
import { useGlobalContext } from '@codeleap/common'
import { TouchableProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const Touchable = forwardRef(<T extends NativeHTMLElement = 'button'>(touchableProps: TouchableProps<T>, ref) => {
  const allProps = {
    ...Touchable.defaultProps,
    ...touchableProps,
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
    analyticsEnabled,
    analyticsName,
    analyticsData,
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

  const { logger } = useGlobalContext()

  const notPressable = !TypeGuards.isFunction(onPress) && !TypeGuards.isFunction(onClick)

  const handleClick = (event) => {
    if (disabled) return

    if (!propagate) stopPropagation(event)

    if (notPressable) return

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

  const testId = getTestId(allProps)

  return (
    // @ts-expect-error
    <View
      component={Component || 'button'}
      {...props}
      debugName={debugName}
      onClick={handleClick}
      onKeyDown={handleClick}
      ref={ref}
      style={[styles.wrapper, disabled && styles['wrapper:disabled']]}
      data-testid={testId}
    />
  )
}) as StyledComponentWithProps<TouchableProps>

Touchable.styleRegistryName = 'Touchable'
Touchable.elements = ['wrapper']
Touchable.rootElement = 'wrapper'

Touchable.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Touchable as (props: StyledComponentProps<TouchableProps, typeof styles>) => IJSX
}

Touchable.defaultProps = {
  propagate: true,
  debounce: null,
  component: View as unknown as 'button',
  analyticsEnabled: false,
  analyticsName: null,
  analyticsData: {},
  tabIndex: 0,
} as Partial<TouchableProps<'button'>>

WebStyleRegistry.registerComponent(Touchable)
