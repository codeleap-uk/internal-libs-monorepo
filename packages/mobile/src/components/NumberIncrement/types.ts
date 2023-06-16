import {
  ComponentVariants,
  yup,
  StylesOf,
  PropsOf,
  FormTypes,
} from '@codeleap/common'
import { NumberIncrementPresets, NumberIncrementComposition } from './styles'
import { TextInputMaskProps } from '../../modules/textInputMask'
import { TextInputProps as NativeTextInputProps } from 'react-native'
import { View } from '../View'
import { Touchable } from '../Touchable'
import { InputBaseProps } from '../InputBase'

type Masking = FormTypes.TextField['masking']
type MaskOptions =  Masking['options']

export type NumberIncrementProps = 
  Omit<InputBaseProps, 'styles' | 'variants'> &
  NativeTextInputProps & {
  variants?: ComponentVariants<typeof NumberIncrementPresets>['variants']
  styles?: StylesOf<NumberIncrementComposition>
  value: number
  validate?: FormTypes.ValidatorWithoutForm<string> | yup.SchemaOf<string>
  style?: PropsOf<typeof View>['style']
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
  mask?: MaskOptions['mask']
  formatter?: (value: string | number) => string
  parseValue?: (value: string) => number
  timeoutActionFocus?: number
  actionPressAutoFocus?: boolean
  actionDebounce?: number | null
} & Pick<PropsOf<typeof Touchable>, 'onPress'>
