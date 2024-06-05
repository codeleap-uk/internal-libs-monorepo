import { onMount, TypeGuards } from '@codeleap/common'
import React, { forwardRef } from 'react'
import { stopPropagation } from '../../lib'
import { View } from '../View'
import { NativeHTMLElement } from '../../types'
import { getTestId } from '../../lib/utils/test'
import { useGlobalContext } from '../../contexts/GlobalContext'
import { TouchableProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'

export const TouchableCP = <T extends NativeHTMLElement = 'button'>(touchableProps: TouchableProps<T>, ref) => {

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
    css,
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
    styles.wrapper,
    disabled && styles['wrapper:disabled'],
    css,
    style,
  ]), [styles, disabled, style])

  const testId = getTestId(allProps)

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
      data-testid={testId}
    />
  )
}

TouchableCP.styleRegistryName = 'Touchable'

TouchableCP.elements = ['wrapper']

TouchableCP.rootElement = 'wrapper'

TouchableCP.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Touchable as (props: StyledComponentProps<TouchableProps, typeof styles>) => IJSX
}

TouchableCP.defaultProps = {
  propagate: true,
  debounce: null,
  component: View as unknown as 'button',
  style: {},
  styles: {},
  analyticsEnabled: false,
  analyticsName: null,
  analyticsData: {},
  tabIndex: 0,
} as Partial<TouchableProps<'button'>>

WebStyleRegistry.registerComponent(TouchableCP)

export const Touchable = forwardRef(TouchableCP) as (<T extends NativeHTMLElement = 'button'>(touchableProps: TouchableProps<T>) => JSX.Element) & {
  defaultProps: Partial<TouchableProps<'button'>>
}

export * from './styles'
export * from './types'
