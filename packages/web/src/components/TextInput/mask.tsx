import { TypeGuards } from '@codeleap/common'
import { FormatChar, InputMaskProps, MaskProps, TextInputMaskTypeProp } from './types'

export const getMaskInputProps = ({ masking }: InputMaskProps): MaskProps & { notSaveFormatted: boolean } => {
  const {
    type = 'custom',
    options = {},
  } = masking

  const maskType = masking?.options?.maskType ?? 'INTERNATIONAL'
  const phoneType = maskType === 'INTERNATIONAL' ? 'cel-phone' : 'cel-phone-brl'

  const presetProps = masking?.type === 'cel-phone' ? maskPreset[phoneType] : maskPreset[type]

  const isObfuscated = options?.obfuscated === true && {
    type: 'password',
  }

  const notSaveFormatted = (TypeGuards.isBoolean(masking?.saveFormatted) && masking?.saveFormatted === false)

  const props = {
    ...presetProps,
    ...options,
    ...isObfuscated,
    notSaveFormatted,
    beforeMaskedValueChange: masking?.onChangeMask,
  }

  const defaultGetRawValue = (value: string) => {
    return String(value)?.replace(/\D/g, '')
  }

  return {
    ...props,
    validator: notSaveFormatted ? null : props?.validator,
    getRawValue: props?.getRawValue ?? defaultGetRawValue,
  }
}

const format: Record<string, FormatChar> = {
  number: "['0123456789']",
}

const validatorRegExp = (value: string | number, regex: RegExp, error: string) => {
  const isValid = regex.test(String(value))

  return {
    valid: isValid,
    message: error,
  }
}

export const maskPreset: Record<TextInputMaskTypeProp | 'cel-phone-brl', MaskProps> = {
  'credit-card': {
    mask: '9999 9999 9999 9999',
    placeholder: 'xxxx xxxx xxxx xxxx',
    formatChars: {
      '9': format.number,
    },
    validator: (value: string) => {
      return validatorRegExp(value, /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, 'Invalid information')
    },
  },
  'cpf': {
    mask: '999.999.999-99',
    placeholder: 'xxx.xxx.xxx-xx',
    formatChars: {
      '9': format.number,
    },
    validator: (value: string) => {
      return validatorRegExp(value, /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Invalid CPF')
    },
  },
  'cnpj': {
    mask: '99.999.999/9999-99',
    placeholder: 'xx.xxx.xxx/xxxx-xx',
    formatChars: {
      '9': format.number,
    },
    validator: (value: string) => {
      return validatorRegExp(value, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'Invalid CNPJ')
    },
  },
  'zip-code': {
    mask: '99999-999',
    placeholder: 'xxxxx-xxx',
    formatChars: {
      '9': format.number,
    },
    validator: (value: string) => {
      return validatorRegExp(value, /^\d{5}-\d{3}$/, 'Invalid zip code')
    },
  },
  'cel-phone': {
    mask: '+999 999 999 999',
    placeholder: '+xxx xxx xxx xxx',
    maskType: 'INTERNATIONAL',
    formatChars: {
      '9': format.number,
    },
    validator: (value: string) => {
      return validatorRegExp(value, /^\+\d{3}\s\d{3}\s\d{3}\s\d{3}$/, 'Invalid phone')
    },
  },
  'cel-phone-brl': {
    mask: '(99) 99999-9999',
    placeholder: '(xx) xxxxx-xxxx',
    maskType: 'BRL',
    formatChars: {
      '9': format.number,
    },
    validator: (value: string) => {
      return validatorRegExp(value, /^\(?\d{2}\)?\s?9?\d{4}-\d{4}$/, 'Invalid phone')
    },
  },
  'custom': {},
}
