import { MaskedTextInputMaskType } from './types'

type MaskPreset = {
  mask?: string
  lazy?: boolean
  placeholderChar?: string
}

export const maskPresets: Record<MaskedTextInputMaskType | 'cel-phone-brl', MaskPreset> = {
  'credit-card': {
    mask: '0000 0000 0000 0000',
    lazy: false,
    placeholderChar: '0',
  },
  'cpf': {
    mask: '000.000.000-00',
    lazy: false,
    placeholderChar: '0',
  },
  'cnpj': {
    mask: '00.000.000/0000-00',
    lazy: false,
    placeholderChar: '0',
  },
  'zip-code': {
    mask: '00000-000',
    lazy: false,
    placeholderChar: '0',
  },
  'cel-phone': {
    mask: '+000 000 000 000',
    lazy: false,
    placeholderChar: '0',
  },
  'cel-phone-brl': {
    mask: '(00) 00000-0000',
    lazy: false,
    placeholderChar: '0',
  },
  'custom': {},
}
