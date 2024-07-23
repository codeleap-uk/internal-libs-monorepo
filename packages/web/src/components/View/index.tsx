import { useMemo, TypeGuards } from '@codeleap/common'
import React, { forwardRef } from 'react'
import { useMediaQuery } from '../../lib/hooks'
import { motion } from 'framer-motion'
import { ViewProps } from './types'
import { getTestId } from '../../lib/utils/test'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps, useTheme } from '@codeleap/styles'
import { NativeHTMLElement } from '../../types'

export * from './styles'
export * from './types'

export const View = forwardRef(<T extends NativeHTMLElement = 'div'>(viewProps: ViewProps<T>, ref) => {
  const {
    component,
    children,
    is,
    not,
    up,
    onHover,
    debugName,
    down,
    style,
    animated,
    animatedProps,
    ...props
  } = {
    ...View.defaultProps,
    ...viewProps,
  }

  const styles = useStylesFor(View.styleRegistryName, style)

  const Component = animated ? (motion?.[component] || motion.div) : (component || 'div')

  const theme = useTheme(store => store.current)

  function handleHover(isMouseOverElement: boolean) {
    onHover?.(isMouseOverElement)
  }

  const platformMediaQuery = useMemo(() => {
    // @ts-expect-error theme type
    return theme?.media?.renderToPlatformQuery({
      is,
      not,
      up,
      down,
    })
  }, [is, not, up, down])

  const matches = useMediaQuery(platformMediaQuery)

  const onHoverProps = TypeGuards.isFunction(onHover) && {
    onMouseEnter: () => handleHover(true),
    onMouseLeave: () => handleHover(false),
  }

  const testId = getTestId(viewProps)

  return (
    <Component
      // @ts-expect-error
      ref={ref}
      {...onHoverProps}
      {...props}
      {...animatedProps}
      data-testid={testId}
      // @ts-expect-error icss type
      css={[styles.wrapper, matches && { display: 'none' }]}
    >
      {children}
    </Component>
  )
}) as StyledComponentWithProps<ViewProps>

View.styleRegistryName = 'View'
View.elements = ['wrapper']
View.rootElement = 'wrapper'

View.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return View as <T extends NativeHTMLElement = 'div'>(props: StyledComponentProps<ViewProps<T>, typeof styles>) => IJSX
}

View.defaultProps = {
  component: 'div',
  animated: false,
} as Partial<ViewProps>

WebStyleRegistry.registerComponent(View)
