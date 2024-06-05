/** @jsx jsx */
import { useMemo, TypeGuards } from '@codeleap/common'
import React, { forwardRef } from 'react'
import { useMediaQuery } from '../../lib/hooks'
import { ComponentWithDefaultProps } from '../../types'
import { motion } from 'framer-motion'
import { ViewComponentProps, ViewProps } from './types'
import { getTestId } from '../../lib/utils/test'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { useGlobalContext } from '../../contexts/GlobalContext'
import { AnyRecord, GenericStyledComponentAttributes, IJSX, StyledComponentProps, useTheme } from '@codeleap/styles'

export const View = forwardRef(({ viewProps, ref }: ViewComponentProps) => {

  const {
    component,
    children,
    is,
    not,
    up,
    onHover,
    debugName,
    down,
    scroll,
    debug,
    style,
    animated,
    animatedProps,
    css = [],
    ...props
  } = {
    ...View.defaultProps,
    ...viewProps,
  }

  const styles = useStylesFor(View.styleRegistryName, style)

  const Component = animated ? (motion?.[component] || motion.div) : (component || 'div')

  const theme = useTheme(store => store.current)

  const { logger } = useGlobalContext()

  function handleHover(isMouseOverElement: boolean) {
    onHover?.(isMouseOverElement)
  }

  const platformMediaQuery = useMemo(() => {
    return theme.media.renderToPlatformQuery({
      is,
      not,
      up,
      down,
    })
  }, [is, not, up, down])

  const matches = useMediaQuery(platformMediaQuery)

  const componentStyles = useMemo(() => {
    return [
      styles.wrapper,
      scroll && { overflowY: 'scroll' },
      matches && { display: 'none' },
      style,
      css,
    ]
  }, [styles, scroll, matches, css])

  const onHoverProps = TypeGuards.isFunction(onHover) && {
    onMouseEnter: () => handleHover(true),
    onMouseLeave: () => handleHover(false),
  }

  if (debug) {
    logger.log(debugName, { componentStyles, platformMediaQuery, matches })
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
      css={componentStyles}
    >
      {children}
    </Component>
  )
}) as ComponentWithDefaultProps<ViewProps<any>> & GenericStyledComponentAttributes<AnyRecord>

View.styleRegistryName = 'View'
View.elements = ['wrapper']
View.rootElement = 'wrapper'

View.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return View as (<T extends React.ElementType = 'div'>(props: StyledComponentProps<ViewProps<T>, typeof styles>) => IJSX)
}

View.defaultProps = {
  component: 'div',
  scroll: false,
  debug: false,
  animated: false,
} as Partial<ViewComponentProps>

WebStyleRegistry.registerComponent(View)

export * from './styles'
export * from './types'
