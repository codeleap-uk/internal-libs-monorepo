import { AppIcon, StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { CheckboxComposition } from './styles'

export type CheckboxProps =
  Pick<InputBaseProps, 'debugName' | 'disabled' | 'label'> &
  {
    value: boolean
    onValueChange: (value: boolean) => void
    style?: StyledProp<CheckboxComposition>
    checkboxOnLeft?: boolean
    checkIcon?: AppIcon
  }
