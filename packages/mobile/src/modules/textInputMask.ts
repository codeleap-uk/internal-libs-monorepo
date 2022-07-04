// @ts-ignore
// import MaskInput from 'react-native-mask-input'
import { TextInputMask } from 'react-native-masked-text'

import { TextInputMaskProps } from './types/textInputMask'

export const MaskedTextInput = TextInputMask as unknown as React.ForwardRefExoticComponent<TextInputMaskProps & {
    ref?: any
}>

export * from './types/textInputMask'
