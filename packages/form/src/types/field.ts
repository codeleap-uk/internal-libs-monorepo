import {  WritableStore } from 'nanostores'
import { Validator } from './validation'
 


export type FieldState<T> = WritableStore<T>

export interface ExtraFieldOptions {

}

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

  onValueChange?: (newValue: T) => void

} & ExtraFieldOptions


export type FieldMeasureResult = {
  x?: number
  y?: number
  width?: number
  height?: number
  pageX?: number
  pageY?: number 
}