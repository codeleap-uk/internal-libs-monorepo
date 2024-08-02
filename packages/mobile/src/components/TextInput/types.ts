import { InputBaseProps } from '../InputBase'
import { TextInputProps as RNTextInputProps } from 'react-native'
import { AnyFunction, FormTypes, yup } from '@codeleap/common'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { TextInputMaskProps } from '../../modules/textInputMask'
import { TextInputComposition } from './styles'

export type TextInputProps =
  Omit<InputBaseProps, 'style'> &
  Omit<RNTextInputProps, 'style'> &
  {
    password?: boolean
    validate?: FormTypes.ValidatorFunctionWithoutForm | yup.SchemaOf<string>
    debugName: string
    visibilityToggle?: boolean
    masking?: FormTypes.TextField['masking']
    onChangeMask?: TextInputMaskProps['onChangeText']
    visibleIcon?: AppIcon
    hiddenIcon?: AppIcon
    _error?: string
    onPress?: AnyFunction
    style?: StyledProp<TextInputComposition>
  }
