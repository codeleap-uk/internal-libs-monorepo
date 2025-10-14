import { TextInputProps } from '../TextInput'
import { ReactMaskOpts } from 'react-imask'

export type MaskedTextInputMaskType =
  | 'credit-card'
  | 'cpf'
  | 'cnpj'
  | 'zip-code'
  | 'cel-phone'
  | 'custom'

export type MaskedTextInputProps = Omit<TextInputProps, 'multiline'> & {
  maskType?: MaskedTextInputMaskType
  maskOptions?: ReactMaskOpts
  onAccept?: (value: string, maskRef?: any, e?: InputEvent) => void
  onComplete?: (value: string, maskRef?: any, e?: InputEvent) => void
  unmask?: boolean | 'typed'
}
