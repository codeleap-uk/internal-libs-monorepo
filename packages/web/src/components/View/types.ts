import { BaseViewProps, BreakpointPlaceholder, ComponentVariants } from '@codeleap/common'
import { HTMLProps, NativeHTMLElement } from '../../types'
import { MotionProps } from 'framer-motion'
import { ViewPresets } from './styles'

export type DefaultProps<T extends NativeHTMLElement> =
  HTMLProps<T> &
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
    animated?: boolean
  } & BaseViewProps

export type ViewProps<T extends NativeHTMLElement> = DefaultProps<T> & (DefaultProps<T>['animated'] extends boolean ? Partial<MotionProps> : {})
