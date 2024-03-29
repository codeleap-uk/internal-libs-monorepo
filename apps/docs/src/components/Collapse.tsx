/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Scroll, View } from '@/components'
import { TypeGuards } from '@codeleap/common'

type CollapseProps = {
  open: boolean
  height?: number
  css?: any
  scroll?: boolean
  children: React.ReactNode
}

export const Collapse = ({ open, height = 1000, scroll, children, ...props }: CollapseProps) => {
  const Component = scroll ? Scroll : View

  return (
    <Component css={[
      {
        height: 'auto',
        maxHeight: open ?
          (TypeGuards.isString(height) ? height : `${height}px`)
          : '0px',
        transition: 'max-height 0.3s ease',
        overflowY: scroll ? (open ? 'auto' : 'hidden') : 'hidden',
      },
    ]} {...props}>
      {children}
    </Component>
  )
}
