import { StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { SwitchComposition } from './styles'
import { BooleanField } from '@codeleap/form'

export type SwitchProps =
  Omit<InputBaseProps, 'style'> &
  {
    field?: BooleanField<any>
    style?: StyledProp<SwitchComposition>
    switchOnLeft?: boolean
    forceError?: boolean
  }
