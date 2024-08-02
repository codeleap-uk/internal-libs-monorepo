import { StyledProp } from '@codeleap/styles'
import { ViewProps } from '../View'
import { OverlayComposition } from './styles'
import { AnyFunction } from '@codeleap/common'

export type OverlayProps =
  Omit<ViewProps, 'style'> &
  {
    debugName: string
    visible?: boolean
    style?: StyledProp<OverlayComposition>
    onPress?: AnyFunction
  }
