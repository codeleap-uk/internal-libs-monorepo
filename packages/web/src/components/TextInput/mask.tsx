import { TypeGuards } from '@codeleap/types'
import { InputMaskProps, IMaskConfig, TextInputMaskTypeProp } from './types'
import { FactoryArg } from 'imask'

export const getMaskInputProps = ({ masking }: InputMaskProps): IMaskConfig & { notSaveFormatted: boolean } => {
  const {
    type = 'custom',
    options = {},
  } = masking

  const maskType = masking?.options?.maskType ?? 'INTERNATIONAL'
  const phoneType = maskType === 'INTERNATIONAL' ? 'cel-phone' : 'cel-phone-brl'

  const presetProps = masking?.type === 'cel-phone' ? maskPreset[phoneType] : maskPreset[type]

  const isObfuscated = options?.obfuscated === true

  const notSaveFormatted = (TypeGuards.isBoolean(masking?.saveFormatted) && masking?.saveFormatted === false)

  const defaultGetRawValue = (value: string) => {
    return String(value)?.replace(/\D/g, '')
  }

  return {
    ...presetProps,
    ...options,
    obfuscated: isObfuscated,
    notSaveFormatted,
    onAccept: masking?.onChangeMask,
    getRawValue: options?.getRawValue ?? defaultGetRawValue,
  }
}

const validatorRegExp = (value: string | number, regex: RegExp, error: string) => {
  const isValid = regex.test(String(value))

  return {
    valid: isValid,
    message: error,
  }
}

export const maskPreset: Record<TextInputMaskTypeProp | 'cel-phone-brl', IMaskConfig> = {
  'credit-card': {
    mask: '0000 0000 0000 0000',
    lazy: false,
    placeholderChar: 'x',
  },
  'cpf': {
    mask: '000.000.000-00',
    lazy: false,
    placeholderChar: 'x',
  },
  'cnpj': {
    mask: '00.000.000/0000-00',
    lazy: false,
    placeholderChar: 'x',
  },
  'zip-code': {
    mask: '00000-000',
    lazy: false,
    placeholderChar: 'x',
  },
  'cel-phone': {
    mask: '+000 000 000 000',
    lazy: false,
    placeholderChar: 'x',
  },
  'cel-phone-brl': {
    mask: '(00) 00000-0000',
    lazy: false,
    placeholderChar: 'x',
  },
  'custom': {},
}
