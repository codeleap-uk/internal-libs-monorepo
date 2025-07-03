import { CheckboxComposition } from './styles'
import { InputBaseProps } from '../InputBase'
import { ComponentCommonProps } from '../../types'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { BooleanField } from '@codeleap/form'

export type CheckboxProps =
  Pick<InputBaseProps, 'disabled' | 'label'> &
  ComponentCommonProps &
  {
    style?: StyledProp<CheckboxComposition>
    checkboxOnLeft?: boolean
    checkIcon?: AppIcon
    field?: BooleanField<any>
    value?: boolean
    onValueChange?: (value: boolean) => void
  }
