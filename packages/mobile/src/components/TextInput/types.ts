import { InputBaseProps } from '../InputBase'
import { TextInputProps as RNTextInputProps, TextInput as RNTextInput } from 'react-native'
import { AnyFunction } from '@codeleap/types'
import { FormTypes, yup } from '@codeleap/form'
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
    autoAdjustSelection?: boolean
    selectionStart?: number
    visibilityToggle?: boolean
    masking?: FormTypes.TextField['masking']
    onChangeMask?: TextInputMaskProps['onChangeText']
    visibleIcon?: AppIcon
    hiddenIcon?: AppIcon
    _error?: string
    onPress?: AnyFunction
    style?: StyledProp<TextInputComposition>
    ref?: React.Ref<RNTextInput>
  }
