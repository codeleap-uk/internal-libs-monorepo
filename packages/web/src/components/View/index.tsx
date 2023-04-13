/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  useCodeleapContext,
  BaseViewProps,
  useMemo
} from '@codeleap/common'
import {
  ComponentPropsWithRef,
  ElementType,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
} from 'react'
import { ViewPresets } from './styles'
import { useMediaQuery } from '../../lib/hooks'

export * from './styles'

export type ViewProps<T extends ElementType> = ComponentPropsWithRef<T> &
  ComponentVariants<typeof ViewPresets> & {
    component?: T
    children?: ReactNode
    css?: any
    scroll?: boolean
    debug?: boolean
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
    css: cssProp,
    scroll = false,
    debug = false,
    ...props
  } = viewProps
  const variantStyles = useDefaultComponentStyle('View', {
    responsiveVariants,
    variants,
    styles,
  })
  const { Theme, logger } = useCodeleapContext()

  function handleHover(isMouseOverElement: boolean) {
    onHover && onHover(isMouseOverElement)
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

  if(debug){
    logger.log('View', {variantStyles, platformMediaQuery, matches})
  }

  return (
    <Component
      // className={cx(css([variantStyles.wrapper, scroll && {overflowY: 'scroll'}, platformMediaQuery]), cssProp)}
      css={[variantStyles.wrapper, scroll && { overflowY: 'scroll' }, matches && { display: 'none' }]}
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
