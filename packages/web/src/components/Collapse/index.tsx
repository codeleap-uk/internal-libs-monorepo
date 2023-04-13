/** @jsx jsx */
import { jsx } from '@emotion/react'

import { capitalize, TypeGuards } from '@codeleap/common'
import { Scroll } from '../Scroll'
import { View, ViewProps } from '../View'
import { ElementType } from 'react'

export type CollapseAxis = 'horizontal' | 'vertical'

export type GetCollapseStylesArgs = {
  direction?: CollapseAxis
  value: string | number
   animation?: string
   scroll ?: boolean
}

type CollapseComposition = 'wrapper' | 'wrapper:open' |'wrapper:hidden'

export function getCollapseStyles<
    TCSS = React.CSSProperties,
    Return extends Record<CollapseComposition, TCSS> = Record<CollapseComposition, TCSS>
>(
  args: GetCollapseStylesArgs,
): Return {
  const {
    direction = 'vertical',
    value,
    animation = '0.3s ease',
    scroll = false,

  } = args

  const dimension = direction === 'horizontal' ? 'width' : 'height'
  const capitalizedDimension = capitalize(dimension)
  const overflowOpen = scroll ? 'auto' : 'hidden'
  const axis = direction === 'vertical' ? 'Y' : 'X'
  return {
    'wrapper:closed': {
      [`max${capitalizedDimension}`]: '0px',
      [`overflow${axis}`]: 'hidden',
    },
    'wrapper:open': {
      [`max${capitalizedDimension}`]: TypeGuards.isString(value) ? value : `${value}px`,
      [`overflow${axis}`]: overflowOpen,
    },
    wrapper: {
      height: 'auto',
      transition: `max-${dimension} ${animation}`,
    },
  } as unknown as Return
}

export type CollapseProps<T extends ElementType = 'div'> = ViewProps<T> & {
    open: boolean
    scroll?: boolean
    size?: string | number
    direction?: CollapseAxis
    animation?: string
}

export const Collapse:React.FC<CollapseProps> = ({
  open,
  size = 1000,
  scroll = false,
  children,
  direction,
  animation,
  ...props
}) => {

  const Component = scroll ? Scroll : View
  const styles = getCollapseStyles({
    value: size,
    direction,
    animation,
  })
  // @ts-ignore
  return <Component css={[
    styles.wrapper,
    open ? styles['wrapper:open'] : styles['wrapper:closed'],
  ]} {...props}>
    {children}
  </Component>
}

export * from './styles'