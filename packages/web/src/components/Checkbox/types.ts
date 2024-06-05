import { IconPlaceholder } from '@codeleap/common'
import { CheckboxComposition } from './styles'
import { InputBaseProps } from '../InputBase'
import { ComponentCommonProps } from '../../types'
import { StyledProp } from '@codeleap/styles'

export type CheckboxProps = Pick<InputBaseProps, 'debugName' | 'disabled' | 'label'> & ComponentCommonProps & {
  style: StyledProp<CheckboxComposition>
  value: boolean
  onValueChange: (value: boolean) => void
  checkboxOnLeft?: boolean
  checkIcon?: IconPlaceholder
}
