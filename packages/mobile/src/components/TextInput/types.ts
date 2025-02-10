import { InputBaseProps } from '../InputBase'
import { TextInputProps as RNTextInputProps, TextInput as RNTextInput } from 'react-native'
import { AnyFunction } from '@codeleap/types'

import { AppIcon, StyledProp } from '@codeleap/styles'
import { TextInputMaskProps } from '../../modules/textInputMask'
import { TextInputComposition } from './styles'
import { Field } from '@codeleap/form'

export type TextInputProps =
  Omit<InputBaseProps, 'style'> &
  Omit<RNTextInputProps, 'style'> &
  {
    
    secure?: boolean
    
    debugName: string
    autoAdjustSelection?: boolean
    selectionStart?: number
    visibilityToggle?: boolean
    
    onChangeMask?: TextInputMaskProps['onChangeText']
    visibleIcon?: AppIcon
    hiddenIcon?: AppIcon
    _error?: string
    onPress?: AnyFunction
    style?: StyledProp<TextInputComposition>
    ref?: React.Ref<RNTextInput>

    field?: Field<string|number, any, any>
  }
