import { AppIcon, StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { CheckboxComposition } from './styles'
import { Field } from '@codeleap/form'

export type CheckboxProps =
  Pick<InputBaseProps, 'debugName' | 'disabled' | 'label'> &
  {
    field?: Field<boolean, any, any>
    style?: StyledProp<CheckboxComposition>
    checkboxOnLeft?: boolean
    checkIcon?: AppIcon
    forceError?: boolean
  }
