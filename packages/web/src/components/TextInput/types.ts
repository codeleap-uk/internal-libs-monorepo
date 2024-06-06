import { FormTypes, IconPlaceholder, TextInputComposition, yup } from '@codeleap/common'
import { TextInputMaskingProps } from './mask'
import { TouchableProps } from '../Touchable'
import { StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { HTMLProps } from '../../types'

type NativeTextInputProps = HTMLProps<'input'>

export type TextInputProps = InputBaseProps & Omit<NativeTextInputProps, 'value' | 'crossOrigin' | 'ref'> & {
    style?: StyledProp<TextInputComposition>
    password?: boolean
    validate?: FormTypes.ValidatorWithoutForm<string> | yup.SchemaOf<string>
    debugName?: string
    visibilityToggle?: boolean
    value?: NativeTextInputProps['value']
    multiline?: boolean
    onPress?: TouchableProps['onPress']
    onChangeText?: (textValue: string) => void
    caretColor?: string
    focused?: boolean
    _error?: boolean
    rows?: number
    masking?: TextInputMaskingProps
    visibleIcon?: IconPlaceholder
    hiddenIcon?: IconPlaceholder
  }

export type InputRef = {
  isTextInput?: boolean
  focus: () => void
  getInputRef: () => HTMLInputElement
}
