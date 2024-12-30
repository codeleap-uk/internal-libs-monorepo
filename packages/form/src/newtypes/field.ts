import {  WritableStore } from 'nanostores'
import { Validator } from './validation'
 


export type FieldState<T> = WritableStore<T>

export type FieldOptions<
  T, 
  Validate extends Validator<T, any, any>
> = {
  name?: string
  defaultValue?: T | null
  state?: FieldState<T>
  
  validate?: Validate
  
  loader?: (form: any) => Partial<
    Omit<FieldOptions<T, Validate >, 'loader'>
  >

}


