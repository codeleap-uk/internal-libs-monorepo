/** @jsx jsx */
import { jsx } from '@emotion/react'

import { View } from '@/app'
import { TypeGuards } from '@codeleap/common'

type CollapseProps = {
    open: boolean
    height?: number
    css?:any
}

export const Collapse:React.FC<CollapseProps> = ({ open, height = 1000, children, ...props }) => {
  // @ts-ignore
  return <View css={[
    {
      height: 'auto',
      maxHeight: open ?
        (TypeGuards.isString(height) ? height : `${height}px`)
        : '0px',
      transition: 'max-height 0.3s ease',
      overflowY: 'hidden',
    },
  ]} {...props}>
    {children}
  </View>
}
