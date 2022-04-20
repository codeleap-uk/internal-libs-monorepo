import { FormTypes } from '@codeleap/common'
import { ComponentPropsWithoutRef } from 'react'
import { TextInput as NativeTextInput } from 'react-native'
type NativeProps = ComponentPropsWithoutRef<typeof NativeTextInput>

export type TextInputMaskProps = {
    mask: FormTypes.TextField['masking']['mask']
    onChangeText?: (maskedText:string, unmaskedText:string, obfuscatedText:string) => any
} & NativeProps
