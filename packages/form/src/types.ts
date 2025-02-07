import { ReactNode } from 'react'
import { Join, Paths, Prev } from '@codeleap/types'
import * as yup from 'yup'
import { WebInputFile, MobileInputFile, DeepPartial, RNMaskedTextTypes } from '../../types'
import { AnyObject } from 'yup'

type ValidationReturn = { message?: Label; valid?: boolean }

export type ValidatorFunction<T = any, F = any> = (
  value: T,
  formValues: F
) => ValidationReturn
export type ValidatorFunctionWithoutForm<T = any> = (
  value: T
) => ValidationReturn

export type WithTransformer<T> = {
  transformer: (value: T) => any
}
export type Validator<T> = T extends boolean
  ?
      | ValidatorFunction<true>
      | ValidatorFunction<false>
      | yup.BooleanSchema<boolean, AnyObject, true>
      | yup.BooleanSchema<boolean, AnyObject, false>
  : ValidatorFunction<T> | yup.Schema<T>

export type ValidatorWithoutForm<T> = T extends boolean
  ?
      | ValidatorFunction<true>
      | ValidatorFunction<false>
      | yup.BooleanSchema<boolean, AnyObject, true>
      | yup.BooleanSchema<boolean, AnyObject, false>
  : ValidatorFunctionWithoutForm<T> | yup.Schema<T>

export type Options<T> = { label: Label; value: T }[]
export type Option<T> = Options<T>[number]
type FormValidateOn = 'change'

export type FormOutput = 'json'

export type CommonSliderTypes = {
  min?: number
  max?: number
  trackMarks?: number[] | Record<string|number, string>
}

type Mask = Partial<RNMaskedTextTypes.TextInputMaskProps> &{
  saveFormatted?: boolean
}

export type InputValueTypes = {
  checkbox: boolean
  switch: boolean
  text: string
  select: any
  radio: any
  file: AnyFile
  multipleFile: AnyFile[]
  'range-slider': number[]
  slider: number[]
  list: any[]
  date: Date
  number: number
}
export type Label = string | ReactNode

export type CheckboxField = {
  type: 'checkbox'
  defaultValue: boolean
  validate?: Validator<boolean>
  required?: boolean
} & WithTransformer<boolean>

export type SwitchField = {
  type: 'switch'
  defaultValue: boolean
  validate?: Validator<boolean>
  required?: boolean
} & WithTransformer<boolean>

export type ListField<T = any> = {
  type: 'list'
  defaultValue: T[]
  validate?: Validator<T[]>
  required?: boolean
  options?: Options<T>
  placeholder?: string
} & WithTransformer<T[]>

export type SliderField = {
  type: 'slider'
  defaultValue: number
  validate?: Validator<number>
  required?: boolean

} & CommonSliderTypes & WithTransformer<number>

export type RangeSliderField = {
  type: 'range-slider'
  defaultValue: number[]
  validate?: Validator<number[]>
  required?: boolean
} & CommonSliderTypes & WithTransformer<number[]>

export type TextField = {
  type: 'text'
  password?: boolean
  defaultValue: string
  placeholder?: string
  validate?: Validator<string>
  required?: boolean
  masking?: Mask
  multiline?: boolean
} & WithTransformer<string>
export type NumberField = {
  type: 'number'

  defaultValue: number
  placeholder?: string
  validate?: Validator<number>
  required?: boolean
  precision?: number
  masking?: Mask
  min?: number
  max?: number

} & WithTransformer<number>
export type SelectField<T = any> = {
  type: 'select'
  options: Options<T>
  defaultValue: T
  native?: boolean
  placeholder?: string
  validate?: Validator<T>
  required?: boolean
} & WithTransformer<T>

export type RadioField<T = any> = {
  type: 'radio'
  options: Options<T>
  defaultValue: T
  validate?: Validator<T>
  required?: boolean
} & WithTransformer<T>

export type AnyFile = WebInputFile | MobileInputFile|string|number
export type FileField = {
  type: 'file'
  allow?: string[]
  defaultValue: AnyFile
  imageToBase64?: boolean
  multiple?: boolean
  validate?: Validator<AnyFile>
  required?: boolean
} & WithTransformer<AnyFile>

export type MultipleFileField = {
  type: 'multipleFile'
  allow?: string[]
  defaultValue: AnyFile[]
  imageToBase64?: boolean
  multiple?: boolean
  validate?: Validator<AnyFile[]>
  required?: boolean
} & WithTransformer<AnyFile[]>

export type DateField = {
  type: 'date'
  defaultValue: Date
  validate?: Validator<Date>
  required?: boolean
  minimumDate?: Date
  maximumDate?: Date
} & WithTransformer<Date>

export type AllFields =
  | CheckboxField
  | SwitchField
  | TextField
  | SelectField
  | RadioField
  | FileField
  | SliderField
  | RangeSliderField
  | ListField
  | NumberField
  | MultipleFileField
  | DateField

export type FormField = {
  disabled?: boolean
  label?: Label
  autoCapitalize?: boolean | string
  keyboardType?: string
  returnKeyType?: string
  textContentType?: string
  autoComplete?: string
  description?: Label
  debugName?: string
  required?: boolean
  debounce?: number
  componentProps?: any

} & AllFields

export type FieldsMap = Record<string, Partial<FormField>>

export type ResolveOptionsFieldValidation<
  T extends RadioField<any> | SelectField<any>
> = T extends RadioField<any>
  ? RadioField<T['options'][number]['value']>
  : SelectField<T['options'][number]['value']>

export type ValidateFieldsMap<T extends FieldsMap> = {
  [Property in keyof T]: T[Property] extends RadioField<any> | SelectField<any>
    ? ResolveOptionsFieldValidation<T[Property]>
    : T[Property];
}

export type FormConfig<T extends FieldsMap> = ValidateFieldsMap<T>

export type FlattenFields<T extends FieldsMap> = {
  [Property in keyof T]: T[Property] extends RadioField<any> | SelectField
    ? T[Property]['options'][number]['value']
    : InputValueTypes[T[Property]['type']];
}

export type MapValues<T extends FieldsMap> = {
  [Property in keyof T]: T[Property] extends RadioField<any> | SelectField
    ? T[Property]['options'][number]['value']
    : InputValueTypes[T[Property]['type']];
}

export type CreateFormReturn<T extends FieldsMap> = {
  config: T
  defaultValue: MapValues<ValidateFieldsMap<T>>
  staticFieldProps: Record<string, any>
  name: string
  numberOfTextFields: number
}

export type FormStep<Keys extends string = string> = 'setValue' | 'validate' | `validate.${Keys}` | `setValue.${Keys}`
export type UseFormConfig<T extends Record<string, any>> = {
  log?: FormStep<Exclude<keyof T, symbol|number>>[]
  initialState?: DeepPartial<T>
  validateOn?: 'change' | 'none'
}

export type PathsWithValues<T, D extends number = 2> = [D] extends [never]
  ? never
  : T extends Record<string, any>
    ? {
        [K in keyof T]-?: K extends string | number
          ?
              | [`${K}`, T[K]]
              | [
                Join<K, Paths<T[K], Prev[D]>>,
                T[K] extends FlattenFields<any> ? T[K][keyof T[K]] : T[K]
              ]
          : never;
      }[keyof T]
    : ''

export type FormShape<Form extends CreateFormReturn<any>> = MapValues<Form['config']>
export type FormSetters<Values> = {
  [Property in keyof Values]: (value: Values[Property]) => void
}
