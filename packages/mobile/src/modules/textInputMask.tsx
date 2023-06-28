import { TextInputMask, TextInputMaskProps } from 'react-native-masked-text'

export const MaskedTextInput = TextInputMask as unknown as React.ForwardRefExoticComponent<Partial<TextInputMaskProps> & {
    ref?: any
}>

export * from './types/textInputMask'
