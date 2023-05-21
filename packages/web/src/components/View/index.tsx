import {
  ComponentVariants,
  useDefaultComponentStyle,
  useCodeleapContext,
  BaseViewProps,
  useMemo,
  TypeGuards
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
    debugName?: string
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
    scroll = false,
    debug = false,
    debugName = 'View component',
    style,
    css = [],
    ...props
  } = viewProps

  const variantStyles = useDefaultComponentStyle<'u:View', typeof ViewPresets>('u:View', {
    responsiveVariants,
    variants,
    styles,
    rootElement: 'wrapper'
  })

  const { Theme, logger } = useCodeleapContext()

  function handleHover(isMouseOverElement: boolean) {
    onHover(isMouseOverElement)
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
      css
    ]
  }, [scroll, matches, css])

  const onHoverProps = TypeGuards.isFunction(onHover) && {
    onMouseEnter: () => handleHover(true),
    onMouseLeave: () => handleHover(false),
  }

  if (debug){
    logger.log(debugName, { componentStyles, platformMediaQuery, matches })
  }

  return (
    <Component
      ref={ref}
      {...onHoverProps}
      {...props}
      css={componentStyles}
    >
      {children}
    </Component>
  )
}

export const View = forwardRef(ViewCP) as <T extends ElementType = 'div'>(
  props: ViewProps<T>
) => ReactElement
