import { StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { SwitchComposition } from './styles'
import { Field } from '@codeleap/form'

export type SwitchProps =
  Omit<InputBaseProps, 'style'> &
  {
    field?: Field<boolean, any, any>
    style?: StyledProp<SwitchComposition>
    switchOnLeft?: boolean
    forceError?: boolean
  }
