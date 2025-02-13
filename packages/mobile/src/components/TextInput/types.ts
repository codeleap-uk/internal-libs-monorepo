import { InputBaseProps } from '../InputBase'
import { TextInputProps as RNTextInputProps, TextInput as RNTextInput } from 'react-native'
import { AnyFunction } from '@codeleap/types'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { TextInputMaskProps } from '../../modules/textInputMask'
import { TextInputComposition } from './styles'
import { Field } from '@codeleap/form'

export type TextInputProps =
  Omit<InputBaseProps, 'style' | 'ref'> &
  Omit<RNTextInputProps, 'style'> &
  {
    secure?: boolean
    debugName: string
    autoAdjustSelection?: boolean
    selectionStart?: number
    visibilityToggle?: boolean
    onChangeMask?: TextInputMaskProps['onChangeText']
    masking?: TextInputMaskProps['masking']
    visibleIcon?: AppIcon
    hiddenIcon?: AppIcon
    forceError?: string
    onPress?: AnyFunction
    style?: StyledProp<TextInputComposition>
    ref?: React.Ref<RNTextInput>
    field?: Field<string, any, any>
    value?: string
    onValueChange?: (value: string) => void
  }