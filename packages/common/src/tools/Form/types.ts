import { ReactNode } from 'react'
import { Join, Paths, Prev } from '../../types/pathMapping'
import * as yup from 'yup'
import { WebInputFile, MobileInputFile, DeepPartial, RNMaskedTextTypes } from '../../types'
import { AnyObject } from 'yup/lib/object'

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
  : ValidatorFunction<T> | yup.SchemaOf<T>

export type Options<T> = { label: Label; value: T }[]

type FormValidateOn = 'change'

export type FormOutput = 'json'

export type CommonSliderTypes = {
  min?: number
  max?: number
  labels?: string[]
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
  composite: any
  'range-slider': number[]
  slider: number
  list: any[]
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
} & WithTransformer<string>
export type NumberField = {
  type: 'number'

  defaultValue: number
  placeholder?: string
  validate?: Validator<number>
  required?: boolean
  precision?: number
  masking?: Mask

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

export type CompositeField = {
  type: 'composite'
  fields?: FieldsMap
  defaultValue: Record<string, unknown>
  validate?: never
  required?: boolean

} & WithTransformer<Record<string, unknown>>
export type AllFields =
  | CheckboxField
  | SwitchField
  | TextField
  | SelectField
  | RadioField
  | FileField
  | CompositeField
  | SliderField
  | RangeSliderField
  | ListField
  | NumberField
  | MultipleFileField

export type FormField = {
  disabled?: boolean
  label?: Label
  autoCapitalize?: boolean | string
  keyboardType?: string
  returnKeyType?: string
  textContentType?: string
  autoComplete?: string
  subtitle?: Label
  debounce?: number
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
  [Property in keyof T]: T[Property] extends Partial<CompositeField>
    ? FlattenFields<T[Property]['fields']>
    : T[Property] extends RadioField<any> | SelectField
    ? T[Property]['options'][number]['value']
    : InputValueTypes[T[Property]['type']];
}

export type MapValues<T extends FieldsMap> = {
  [Property in keyof T]: T[Property] extends Partial<CompositeField>
    ? MapValues<T[Property]['fields']>
    : T[Property] extends RadioField<any> | SelectField
    ? T[Property]['options'][number]['value']
    : InputValueTypes[T[Property]['type']];
}

export type CreateFormReturn<T extends FieldsMap> = {
  config: T
  defaultValue: MapValues<T>
  staticFieldProps: Record<string, any>
  name: string
  numberOfTextFields: number
}

export type FormStep = 'setValue' | 'validate'

export type UseFormConfig<T> = {
  log?: FormStep[]
  initialState?: DeepPartial<T>
}

export type PathsWithValues<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
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
