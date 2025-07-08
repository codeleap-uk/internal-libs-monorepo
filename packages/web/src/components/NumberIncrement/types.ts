import { NumberIncrementComposition } from './styles'
import { InputBaseProps } from '../InputBase'
import { PatternFormatProps as PFProps, NumericFormatProps as NFProps } from 'react-number-format'
import { FormatInputValueFunction } from 'react-number-format/types/types'
import { StyledProp } from '@codeleap/styles'
import { NumberField } from '@codeleap/form'

export type NumberIncrementProps =
  Pick<InputBaseProps, 'debugName' | 'disabled' | 'label'> &
  {
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
    forceError?: string
    formatter?: FormatInputValueFunction
    placeholder?: string
    field?: NumberField<any>
    value?: number
    onValueChange?: (value: number) => void
  }
