import { ReactNode } from 'react'
import { Join, Paths, Prev } from '../../types/pathMapping'
import * as yup from 'yup'
import { WebInputFile } from '../../types'
import { AnyObject } from 'yup/lib/types'
type ValidationReturn = {message?: Label, valid?: boolean}

export type ValidatorFunction<T = any> = (value:T) => ValidationReturn

export type Validator<T> = 
    ValidatorFunction<T>  | (
        T extends boolean ? yup.BooleanSchema<boolean, AnyObject, true > | yup.BooleanSchema<boolean, AnyObject, false> : yup.SchemaOf<T> 
    )

export type Options<T> = {label: Label, value: T}[]

type FormValidateOn = 'submit' | 'blur' | 'change'

export type FormOutput = 'json' | 'multipart' | 'mixed'

export type CommonSliderTypes = {
    min?: number
    max?: number
}

export type InputValueTypes = {
    checkbox:boolean
    switch: boolean
    text: string
    select: any
    radio: any
    file: WebInputFile[]
    composite: any
    'range-slider': number[]
    'slider': number
}
export type Label = string | ReactNode

export type CheckboxField = {
    type: 'checkbox'
    defaultValue: boolean
    validate?: Validator<boolean>
}
export type SliderField = {
    type: 'slider'
    defaultValue: number
    validate?: Validator<number>
    labels?: string[]
} & CommonSliderTypes

export type RangeSliderField = {
    type: 'range-slider'
    defaultValue: number[]
    validate?: Validator<number[]>
} & CommonSliderTypes

export type TextField = {
    type: 'text'
    password?: boolean
    defaultValue: string 
    validate?: Validator<string>
}

export type SelectField<T = any> = {
    type: 'select'
    options: Options<T>
    defaultValue:T
    native?: boolean
    validate?: Validator<T>
}

export type RadioField<T = any> = {
    type: 'radio'
    options: Options<T>
    defaultValue: T
    validate?: Validator<T>
}

export type FileField = {
    type: 'file'
    allow?: string[]
    defaultValue: WebInputFile[]
    imageToBase64?: boolean
    multiple?: boolean
    validate?: Validator<WebInputFile[]>
}
export type ImageField = {
    type: 'image'
    multiple?: boolean
    validate?: Validator<WebInputFile[]>
}
export type CompositeField = {
    type: 'composite'
    fields?: FieldsMap
    defaultValue: Record<string, unknown>
    validate?:never
}
export type AllFields = CheckboxField | TextField | SelectField | RadioField | FileField | CompositeField | SliderField | RangeSliderField

export type FormField = {
    disabled?: boolean
    label?: Label
    required?: boolean
    subtitle?: Label
    debounce?: number
} & AllFields

export type FieldsMap = Record<string, Partial<FormField>>

export type ResolveOptionsFieldValidation<
    T extends RadioField<any>|SelectField<any>
> = T extends RadioField<any> ? RadioField<T['options'][number]['value']> : SelectField<T['options'][number]['value']>


export type ValidateFieldsMap<T extends FieldsMap> = {
    [Property in keyof T]: 
        T[Property] extends RadioField<any> | SelectField<any> ? 
            ResolveOptionsFieldValidation<T[Property]> : T[Property]
}


export type FormConfig<T extends FieldsMap> = ValidateFieldsMap<T>

export type FlattenFields<T extends FieldsMap> = {
    [Property in keyof T] : 
        T[Property] extends Partial<CompositeField> ? FlattenFields<T[Property]['fields']> :
            T[Property] extends RadioField<any>|SelectField ? T[Property]['options'][number]['value'] :
            InputValueTypes[T[Property]['type']] 
} 

export type MapValues<T extends FieldsMap> = {
    [Property in keyof T] :  T[Property] extends Partial<CompositeField> ? 
        MapValues<T[Property]['fields']>  : 
            T[Property] extends RadioField<any> | SelectField ? T[Property]['options'][number]['value'] :
            InputValueTypes[T[Property]['type']] 
       
} 


// export type CreateFormReturn<T extends FieldsMap, O extends FormOutput = 'json'> = {
//     register(name: Paths<FlattenFields<T>>):any
//     values: MapValues<T>
//     transform: () => O extends 'json' ? MapValues<T> : FormData
// }

export type CreateFormReturn<T extends FieldsMap> = {
    config: T
    defaultValue: MapValues<T>
    staticFieldProps: Record<string, any>
    name: string
}

export type FormStep = 
   
    'setValue'|
    'validate'


export type UseFormConfig = {
    validateOn: FormValidateOn
    output:FormOutput
    log?: FormStep[]
}


export type PathsWithValues<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: K extends string | number ?
        [`${K}`, T[K]] | [ Join<K, Paths<T[K], Prev[D]>>, T[K] extends FlattenFields<any> ? T[K][keyof T[K]]  : T[K]]
        : never
    }[keyof T] : ''
