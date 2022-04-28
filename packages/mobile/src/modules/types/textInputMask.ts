import { FormTypes } from '@codeleap/common'
import { ComponentPropsWithoutRef } from 'react'
import { TextInput as NativeTextInput } from 'react-native'
type NativeProps = ComponentPropsWithoutRef<typeof NativeTextInput>
// @ts-ignore
import { TextInputMaskProps as RNTextInputMaskProps } from 'react-native-masked-text'

export type TextInputMaskProps = {
    masking: FormTypes.TextField['masking'] & {
        type: RNTextInputMaskProps['type']
    }
    onChangeText?: (maskedText:string, unmaskedText:string) => any
} & NativeProps & RNTextInputMaskProps
