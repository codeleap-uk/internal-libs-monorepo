/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  useCodeleapContext,
  useMemo,
  BreakpointPlaceholder,
  BaseViewProps,

  TypeGuards,
} from '@codeleap/common'
import {
  forwardRef,
  Ref,
} from 'react'
import { ViewPresets } from './styles'
import { useMediaQuery } from '../../lib/hooks'
import { HTMLProps, NativeHTMLElement } from '../../types'

export * from './styles'

export type ViewProps<T extends NativeHTMLElement> =
  HTMLProps<T> &
  ComponentVariants<typeof ViewPresets> &
   {
    component?: T
    scroll?: boolean
    debugName?: string
    debug?: boolean
    is?: BreakpointPlaceholder
    not?: BreakpointPlaceholder
    up?: BreakpointPlaceholder
    down?: BreakpointPlaceholder
    onHover?: (isMouseOverElement: boolean) => void
  } & BaseViewProps

export const ViewCP = (
  viewProps: ViewProps<'div'>,
  ref: Ref<any>,
) => {

  const {
    responsiveVariants = {},
    variants = [],
    component: Component = 'div',
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
    css = [],
    ...props
  } = viewProps

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
    >
      {children}
    </Component>
  )
}

export const View = forwardRef(ViewCP) as unknown as <T extends NativeHTMLElement = 'div'>(
  props: ViewProps<T>
) => JSX.Element
