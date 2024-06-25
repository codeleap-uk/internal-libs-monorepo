import { StyledProp } from '@codeleap/styles'
import { View } from '../View'
import { OverlayComposition } from './styles'
import { AnyFunction, PropsOf } from '@codeleap/common'

export type OverlayProps =
  PropsOf<typeof View, 'style'> &
  {
    visible?: boolean
    style?: StyledProp<OverlayComposition>
    onPress?: AnyFunction
  }
