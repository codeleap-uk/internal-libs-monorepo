import { RNMaskedTextTypes } from '@codeleap/types'
import { TextInputProps } from 'react-native'

import { TextInputMaskProps as RNTextInputMaskProps } from 'react-native-masked-text'

type Mask = Partial<RNMaskedTextTypes.TextInputMaskProps> & {
  saveFormatted?: boolean
}

export type TextInputMaskProps = Omit<RNTextInputMaskProps, keyof TextInputProps> & {
  masking: Mask
  onChangeText: RNTextInputMaskProps['onChangeText']
}
