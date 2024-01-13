/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'
import { useDefaultComponentStyle, useCodeleapContext, useMemo, TypeGuards } from '@codeleap/common'
import { forwardRef, Ref } from 'react'
import { ViewPresets } from './styles'
import { useMediaQuery } from '../../lib/hooks'
import { NativeHTMLElement } from '../../types'
import { motion } from 'framer-motion'
import { ViewProps } from './types'

export * from './styles'
export * from './types'

export const ViewCP = (
  viewProps: ViewProps<'div'>,
  ref: Ref<any>,
) => {
  const {
    responsiveVariants = {},
    variants = [],
    component = 'div',
    children,
    is,
    not,
    up,
    onHover,
    debugName,
    down,
    scroll = false,
    debug = false,
    style,
    animated = false,
    animatedProps = {},
    css = [],
    ...props
  } = viewProps

  const Component = animated ? (motion?.[component] || motion.div) : (component || 'div')

  const variantStyles = useDefaultComponentStyle<'u:View', typeof ViewPresets>('u:View', {
    responsiveVariants,
    variants,
    styles: { wrapper: style },
    rootElement: 'wrapper',
  })

  const { Theme, logger } = useCodeleapContext()

  function handleHover(isMouseOverElement: boolean) {
    onHover?.(isMouseOverElement)
  }

  const platformMediaQuery = useMemo(() => {
    return Theme.media.renderToPlatformQuery({
      is,
      not,
      up,
      down,
    })
  }, [is, not, up, down])

  const matches = useMediaQuery(platformMediaQuery)

  const componentStyles = useMemo(() => {
    return [
      variantStyles.wrapper,
      scroll && { overflowY: 'scroll' },
      matches && { display: 'none' },
      style,
      css,
    ]
  }, [variantStyles, scroll, matches, css])

  const onHoverProps = TypeGuards.isFunction(onHover) && {
    onMouseEnter: () => handleHover(true),
    onMouseLeave: () => handleHover(false),
  }

  if (debug) {
    logger.log(debugName, { componentStyles, platformMediaQuery, matches })
  }

  return (
    <Component
      css={componentStyles}
      ref={ref}
      {...onHoverProps}
      {...props}
      {...animatedProps}
    >
      {children}
    </Component>
  )
}

export const View = forwardRef(ViewCP) as unknown as <T extends NativeHTMLElement = 'div'>(
  props: ViewProps<T>
) => JSX.Element
