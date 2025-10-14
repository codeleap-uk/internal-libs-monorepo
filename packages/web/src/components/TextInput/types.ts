import { TouchableProps } from '../Touchable'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { HTMLProps } from '../../types'
import { TextInputComposition } from './styles'
import { Field } from '@codeleap/form'
import { AnyFunction } from '@codeleap/types'
import { RefObject } from 'react'
import { FactoryArg } from 'imask'

type NativeTextInputProps = HTMLProps<'input'>

export type InputRef = {
  isTextInput?: boolean
  focus: () => void
  getInputRef: () => HTMLInputElement
}

export type TextInputProps =
  Omit<InputBaseProps, 'style' | 'ref'> &
  Omit<NativeTextInputProps, 'value' | 'crossOrigin' | 'ref' | 'style'> &
  {
    style?: StyledProp<TextInputComposition>
    password?: boolean
    debugName?: string
    visibilityToggle?: boolean
    multiline?: boolean
    onPress?: TouchableProps['onPress']
    caretColor?: string
    focused?: boolean
    forceError?: string
    rows?: number
    masking?: TextInputMaskingProps
    visibleIcon?: AppIcon
    hiddenIcon?: AppIcon
    field?: Field<string, any, any>
    value?: string
    onValueChange?: (value: string) => void
    onChangeText?: NativeTextInputProps['onChange']
    ref?: RefObject<InputRef | null>
  }

export type IMaskConfig = {
  mask?: FactoryArg
  obfuscated?: boolean
  lazy?: boolean
  placeholderChar?: string
  maskType?: 'BRL' | 'INTERNATIONAL'
  getRawValue?: (value: any) => string
  onAccept?: AnyFunction
}

export type TextInputMaskTypeProp =
  | 'credit-card'
  | 'cpf'
  | 'cnpj'
  | 'zip-code'
  | 'cel-phone'
  | 'custom'

export interface TextInputMaskingProps {
  type: TextInputMaskTypeProp
  options?: IMaskConfig
  onChangeMask?: AnyFunction
  saveFormatted?: boolean
}

export type InputMaskProps = {
  masking: TextInputMaskingProps
}
