import { TypeGuards } from '@codeleap/types'
import React, { ElementType, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { ViewProps } from './types'
import { getTestId } from '../../lib/utils/test'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const View = forwardRef<HTMLDivElement, ViewProps>((viewProps, ref) => {
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

  const Component: ElementType = animated ? (motion?.[component as string] || motion.div) : (component || 'div')

  function handleHover(isMouseOverElement: boolean) {
    onHover?.(isMouseOverElement)
  }

  const hoverProps = TypeGuards.isFunction(onHover) && {
    onMouseEnter: () => handleHover(true),
    onMouseLeave: () => handleHover(false),
  }

  const testId = getTestId(viewProps)

  return (
    <Component
      {...hoverProps}
      {...props}
      {...animatedProps}
      ref={ref}
      data-testid={testId}
      css={styles.wrapper}
    >
      {children}
    </Component>
  )
}) as StyledComponentWithProps<ViewProps>

View.styleRegistryName = 'View'
View.elements = ['wrapper']
View.rootElement = 'wrapper'

View.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return View as <T extends ElementType = 'div'>(props: StyledComponentProps<ViewProps<T>, typeof styles>) => IJSX
}

View.defaultProps = {
  component: 'div',
  animated: false,
} as Partial<ViewProps>

WebStyleRegistry.registerComponent(View)
