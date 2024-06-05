import { StyledProp } from '@codeleap/styles'
import { NativeHTMLElement } from '../../types'
import { ViewProps } from '../View'
import { CollapseComposition } from './styles'

export type CollapseAxis = 'horizontal' | 'vertical'

export type GetCollapseStylesArgs = {
  direction?: CollapseAxis
  value: string | number
   animation?: string
   scroll ?: boolean
}

export type CollapseProps<T extends NativeHTMLElement = 'div'> = ViewProps<T> & {
    open: boolean
    scroll?: boolean
    size?: string | number
    direction?: CollapseAxis
    animation?: string
    style: StyledProp<CollapseComposition>
}
