// Type prop of TextInputMask.
export type TextInputMaskTypeProp =
    | 'credit-card'
    | 'cpf'
    | 'cnpj'
    | 'zip-code'
    | 'only-numbers'
    | 'money'
    | 'cel-phone'
    | 'datetime'
    | 'custom'

// Option prop of TextInputMask.
export interface TextInputMaskOptionProp {
    // Money type.
    precision?: number
    separator?: string
    delimiter?: string
    unit?: string
    suffixUnit?: string
    zeroCents?: boolean

    // Phone type.
    withDDD?: boolean
    dddMask?: string
    maskType?: 'BRL' | 'INTERNATIONAL'

    // Datetime type.
    format?: string

    // Credit card type.
    obfuscated?: boolean
    issuer?: 'visa-or-mastercard' | 'diners' | 'amex'

    // Custom type.
    mask?: string
    validator?: (value: string, settings: TextInputMaskOptionProp) => boolean
    getRawValue?: (value: string, settings: TextInputMaskOptionProp) => any
    translation?: { [s: string]: (val: string) => string | null | undefined }
}

// TextInputMask Props
export interface TextInputMaskProps {
    type: TextInputMaskTypeProp
    options?: TextInputMaskOptionProp
    checkText?: (previous: string, next: string) => boolean
    customTextInput?: any
    customTextInputProps?: Object
    includeRawValueInChangeText?: boolean
}

