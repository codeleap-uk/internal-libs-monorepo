/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  useCodeleapContext,
  ViewStyles,
  BaseViewProps,
} from '@codeleap/common'
import {
  ComponentPropsWithRef,
  ElementType,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
} from 'react'

export type ViewProps<T extends ElementType> = ComponentPropsWithRef<T> &
  ComponentVariants<typeof ViewStyles> & {
    component?: T
    children?: ReactNode
    css?: any
  } & BaseViewProps

export const ViewCP = <T extends ElementType = 'div'>(
  viewProps: ViewProps<T>,
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
    styles,
    down,
    ...props
  } = viewProps
  const variantStyles = useDefaultComponentStyle('View', {
    responsiveVariants,
    variants,
    styles,
  })
  const { Theme } = useCodeleapContext()

  function handleHover(isMouseOverElement: boolean) {
    onHover && onHover(isMouseOverElement)
  }
  const shouldRenderToPlatform = Theme.hooks.shouldRenderToPlatform({
    is,
    not,
    up,
    down,
  })
  if (!shouldRenderToPlatform) return null

  const platformMediaQuery = Theme.media.renderToPlatformQuery({
    is,
    not,
    up,
    down,
  })

  return (
    <Component
      css={[variantStyles.wrapper, platformMediaQuery]}
      ref={ref}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      {...props}
    >
      {children}
    </Component>
  )
}

export const View = forwardRef(ViewCP) as <T extends ElementType = 'div'>(
  props: ViewProps<T>
) => ReactElement
