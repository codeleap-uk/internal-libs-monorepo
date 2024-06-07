import {
  yup,
  FormTypes,
} from '@codeleap/common'
import { NumberIncrementComposition } from './styles'
import { InputBaseProps } from '../InputBase'
import { PatternFormatProps as PFProps, NumericFormatProps as NFProps } from 'react-number-format'
import { FormatInputValueFunction } from 'react-number-format/types/types'
import { StyledProp } from '@codeleap/styles'

export type NumberIncrementProps = Pick<InputBaseProps, 'debugName' | 'disabled' | 'label'> & {
  value: number
  onValueChange: (value: number) => void
  onChangeText?: (value: number) => void
  validate?: FormTypes.ValidatorWithoutForm<string> | yup.SchemaOf<string>
  style?: StyledProp<NumberIncrementComposition>
  max?: number
  min?: number
  step?: number
  editable?: boolean
  prefix?: NFProps['prefix']
  suffix?: NFProps['suffix']
  separator?: NFProps['thousandSeparator']
  format?: PFProps['format']
  mask?: PFProps['mask']
  hasSeparator?: boolean
  _error?: string
  formatter?: FormatInputValueFunction
  placeholder?: string
}
