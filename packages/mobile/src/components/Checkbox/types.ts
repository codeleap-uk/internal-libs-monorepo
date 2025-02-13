import { AppIcon, StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { CheckboxComposition } from './styles'
import { BooleanField } from '@codeleap/form'

export type CheckboxProps =
  Pick<InputBaseProps, 'debugName' | 'disabled' | 'label'> &
  {
    field?: BooleanField<any>
    style?: StyledProp<CheckboxComposition>
    checkboxOnLeft?: boolean
    checkIcon?: AppIcon
    forceError?: boolean
    value?: boolean
    onValueChange?: (value: boolean) => void
  }
