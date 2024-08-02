import { CheckboxComposition } from './styles'
import { InputBaseProps } from '../InputBase'
import { ComponentCommonProps } from '../../types'
import { AppIcon, StyledProp } from '@codeleap/styles'

export type CheckboxProps =
  Pick<InputBaseProps, 'disabled' | 'label'> &
  ComponentCommonProps &
  {
    style?: StyledProp<CheckboxComposition>
    value: boolean
    onValueChange: (value: boolean) => void
    checkboxOnLeft?: boolean
    checkIcon?: AppIcon
  }
