import { HTMLProps, NativeHTMLElement } from '../../types'
import { AnimationProps, MotionProps } from 'framer-motion'
import { StyledProp } from '@codeleap/styles'
import { ViewComposition } from './styles'

export type ViewComponentProps = {
  viewProps: ViewProps<'div'>
  ref: React.Ref<any>
}

export type ViewProps<T extends NativeHTMLElement> =
  Omit<HTMLProps<T>, 'style'> &
  Omit<AnimationProps, 'style'> &
  {
    component?: T
    scroll?: boolean
    debugName?: string
    debug?: boolean
    is?: any
    not?: any
    up?: any
    down?: any
    onHover?: (isMouseOverElement: boolean) => void
    animated?: boolean
    animatedProps?: Partial<MotionProps>
    style?: StyledProp<ViewComposition>
  }
