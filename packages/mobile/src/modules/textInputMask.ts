// @ts-ignore
import MaskInput from 'react-native-mask-input'
import { TextInputMaskProps } from './types/textInputMask'

export const MaskedTextInput = MaskInput as React.ForwardRefExoticComponent<TextInputMaskProps & {
    ref?: any
}>
