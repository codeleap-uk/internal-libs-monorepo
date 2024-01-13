import { BaseViewProps, BreakpointPlaceholder, ComponentVariants } from '@codeleap/common'
import { HTMLProps, NativeHTMLElement } from '../../types'
import { AnimationProps, MotionProps } from 'framer-motion'
import { ViewPresets } from './styles'

export type ViewProps<T extends NativeHTMLElement> =
  HTMLProps<T> &
  ComponentVariants<typeof ViewPresets> &
  Omit<AnimationProps, 'variants'> &
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
  } & BaseViewProps
