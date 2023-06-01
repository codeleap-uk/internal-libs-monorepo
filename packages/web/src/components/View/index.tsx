/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  useCodeleapContext,
  useMemo,
  BreakpointPlaceholder,
} from '@codeleap/common'
import {
  forwardRef,
  Ref,
} from 'react'
import { ViewPresets } from './styles'
import { useMediaQuery } from '../../lib/hooks'
import { HTMLProps,NativeHTMLElement } from '../../types'

export * from './styles'

export type ViewProps<T extends NativeHTMLElement> =  
  HTMLProps<T>  &
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
  } 

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
    ...props
  } = viewProps

  const variantStyles = useDefaultComponentStyle('View', {
    responsiveVariants,
    variants,
    rootElement: 'wrapper'
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
    logger.log('View', {variantStyles, platformMediaQuery, matches, debugName, className: props.className})
  }

  return (
    <Component
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

export const View = forwardRef(ViewCP) as  unknown as <T extends NativeHTMLElement = 'div'>(
  props: ViewProps<T>
) => JSX.Element
