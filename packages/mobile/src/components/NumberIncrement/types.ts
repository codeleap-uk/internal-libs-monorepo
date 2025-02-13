import { AnyFunction } from '@codeleap/types'
import { NumberIncrementComposition } from './styles'
import { TextInputMaskProps } from '../../modules/textInputMask'
import { TextInputProps as RNTextInputProps } from 'react-native'
import { InputBaseProps } from '../InputBase'
import { StyledProp } from '@codeleap/styles'
import { TextInputProps } from '../TextInput'
import { NumberField } from '@codeleap/form'

type Masking = TextInputProps['masking']
type MaskOptions = Masking['options']

export type NumberIncrementProps =
  Omit<InputBaseProps, 'style'|'value'> &
  Omit<RNTextInputProps, 'style'|'value'> &
  {
    max?: number
    min?: number
    step?: number
    editable?: boolean
    forceError?: string
    placeholder?: string
    onChangeMask?: TextInputMaskProps['onChangeText']
    masking?: Exclude<Masking, 'mask' | 'format'>
    prefix?: MaskOptions['unit']
    suffix?: MaskOptions['suffixUnit']
    separator?: MaskOptions['separator']
    delimiter?: MaskOptions['delimiter']
    precision?: number
    mask?: MaskOptions['mask']
    formatter?: (value: string | number) => string
    parseValue?: (value: string) => number
    timeoutActionFocus?: number
    actionPressAutoFocus?: boolean
    actionDebounce?: number | null
    onPress?: AnyFunction
    style?: StyledProp<NumberIncrementComposition>
    field?: NumberField<any>
    value?: number
    onValueChange?: (value: number) => void
  }
