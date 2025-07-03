import { StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { SwitchComposition } from './styles'
import { BooleanField } from '@codeleap/form'

export type SwitchProps = 
  Pick<InputBaseProps, 'debugName' | 'disabled' | 'label'> & 
  {
    style?: StyledProp<SwitchComposition>
    onChange?: (value: boolean) => void
    switchOnLeft?: boolean
    field?: BooleanField<any>
    value?: boolean
    onValueChange?: (value: boolean) => void
  }
