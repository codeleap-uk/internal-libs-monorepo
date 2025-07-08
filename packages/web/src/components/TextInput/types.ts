import { TouchableProps } from '../Touchable'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { HTMLProps } from '../../types'
import { TextInputComposition } from './styles'
import { Field } from '@codeleap/form'
import { AnyFunction } from '@codeleap/types'

type NativeTextInputProps = HTMLProps<'input'>

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
  }

export type InputRef = {
  isTextInput?: boolean
  focus: () => void
  getInputRef: () => HTMLInputElement
}

type beforeMaskedValueChangeArgs = {
  state: {
    value: string | undefined
    selection: {
      start: number
      end: number
      length?: number
    }
  }
  userInput: null | string
}

export type FormatChar = `[${string}]`

export type MaskProps = {
  obfuscated?: boolean
  mask?: string
  placeholder?: string
  maskChar?: string
  formatChars?: Record<string, FormatChar>
  alwaysShowMask?: boolean
  validator?: AnyFunction
  maskType?: 'BRL' | 'INTERNATIONAL'
  getRawValue?: (value: any) => string
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
  options?: MaskProps
  onChangeMask?: (
    newState: beforeMaskedValueChangeArgs['state'],
    oldState: beforeMaskedValueChangeArgs['state'],
    userInput: beforeMaskedValueChangeArgs['userInput']
  ) => beforeMaskedValueChangeArgs['state']
  saveFormatted?: boolean
}

export type InputMaskProps = {
  masking: TextInputMaskingProps
}
