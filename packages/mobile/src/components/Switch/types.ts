import { StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { SwitchComposition } from './styles'

export type SwitchProps =
  Omit<InputBaseProps, 'style'> &
  {
    value: boolean
    onValueChange: (value: boolean) => void
    style?: StyledProp<SwitchComposition>
    switchOnLeft?: boolean
  }
