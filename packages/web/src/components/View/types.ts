import { BaseViewProps, BreakpointPlaceholder } from '@codeleap/common'
import { HTMLProps, NativeHTMLElement } from '../../types'
import { AnimationProps, MotionProps } from 'framer-motion'
import { StyledProp } from '@codeleap/styles'
import { ViewComposition } from './styles'

export type ViewComponentProps = {
  viewProps: ViewProps<'div'>
  ref: React.Ref<any>
}

export type ViewProps<T extends NativeHTMLElement> =
  HTMLProps<T> &
  AnimationProps &
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
    animated?: boolean
    animatedProps?: Partial<MotionProps>
    style?: StyledProp<ViewComposition>
  } & Omit<BaseViewProps, 'css'>
