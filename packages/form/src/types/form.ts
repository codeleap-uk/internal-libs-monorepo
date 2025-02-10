import { Field } from "../lib/Field"
import { ValidationResult } from "./validation"

export type FormDef = Record<string,  Field<any,any>>

export type NarrowKeyof<T> = Extract<keyof T, string>

export type FormValues<T extends FormDef> = {
  [K in NarrowKeyof<T>]:  T[K]['value']
}

export type FormErrors<T extends FormDef> = {
  [K in NarrowKeyof<T>]:  ReturnType<T[K]['validate']> extends ValidationResult<any, infer E> ? E : never 
}

export type FormResults<T extends FormDef> = {
  [K in NarrowKeyof<T>]:  ReturnType<T[K]['validate']> extends ValidationResult<infer R, any> ? R : never 
}

export type FieldTuples<T extends FormDef> = {
  [K in NarrowKeyof<T>]: [K, T[K]]
}[NarrowKeyof<T>]

export type PropertyForKeys<T extends FormDef, Keys extends FieldPaths<T>,  Property extends keyof Field<any,any>> = {
  [K in Keys]: T[K][Property]
}

export type FieldPropertyTuples<T extends FormDef, Property extends keyof Field<any,any>> = {
  [K in NarrowKeyof<T>]: [K, T[K][Property]]
}[NarrowKeyof<T>]



export type FieldPaths<T extends FormDef> = ({
  [K in NarrowKeyof<T>]: K
})[NarrowKeyof<T>]