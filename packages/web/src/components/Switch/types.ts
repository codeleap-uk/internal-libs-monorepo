import { StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { SwitchComposition } from './styles'

export type SwitchProps = 
  Pick<InputBaseProps, 'debugName' | 'disabled' | 'label'> & 
  {
    style?: StyledProp<SwitchComposition>
    value: boolean
    onValueChange: (value: boolean) => void
    onChange?: (value: boolean) => void
    switchOnLeft?: boolean
  }
