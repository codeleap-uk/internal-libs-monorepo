import { yup, FormTypes, AnyFunction } from '@codeleap/common'
import { NumberIncrementComposition } from './styles'
import { TextInputMaskProps } from '../../modules/textInputMask'
import { TextInputProps as RNTextInputProps } from 'react-native'
import { InputBaseProps } from '../InputBase'
import { StyledProp } from '@codeleap/styles'

type Masking = FormTypes.TextField['masking']
type MaskOptions = Masking['options']

export type NumberIncrementProps =
  Omit<InputBaseProps, 'style'> &
  Omit<RNTextInputProps, 'style'> &
  {
    value: number
    validate?: FormTypes.ValidatorWithoutForm<string> | yup.SchemaOf<string>
    max?: number
    min?: number
    step?: number
    editable?: boolean
    _error?: string
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
  }
