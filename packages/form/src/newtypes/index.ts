import { atom } from 'nanostores'
import { z } from 'zod'

export type ValidationResult<Result, Err> = {
  isValid: boolean
  result?: Result
  error?: Err
} 

export type ValidatorFunction<Value, Result, Err> = (value: Value, form: any) => ValidationResult<Result, Err> 

export type Validator<Value, Result, Err> = ValidatorFunction<Value, Result, Err>

export type Atom<T> = ReturnType<typeof atom<T>>

export type FieldOptions<
  T, 
  Validate extends Validator<T, any, any>
> = {
  name: string
  defaultValue?: T | null
  state?: Atom<T>
  
  validate?: Validate
  
  loader?: (form: any) => Partial<
    Omit<FieldOptions<T, Validate >, 'loader'>
  >

}


export interface IFieldRef<T> {
  getValue(): T
  scrollIntoView(): Promise<void>
  focus(): void
  blur(): void
  emit(event: string, ...args: any[]): void
}