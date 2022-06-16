import { FormTypes } from '@codeleap/common'
import { TextInputProps } from 'react-native'

import { TextInputMaskProps as RNTextInputMaskProps } from 'react-native-masked-text'

export type TextInputMaskProps =Omit<RNTextInputMaskProps, keyof TextInputProps > & {
    masking: FormTypes.TextField['masking']
    onChangeText: RNTextInputMaskProps['onChangeText']
}
