import { FieldState, FieldOptions, FieldMeasureResult } from '../types/field';
import { ValidationResult, Validator } from '../types/validation';
import { IFieldRef,  IFieldProps } from '../types/globals';
import { atom }  from 'nanostores'
import { AnyRecord, SecondToLastArguments, TypeGuards } from '@codeleap/types';
 
import { useStore } from '@nanostores/react'
import { useFieldBinding } from './useFieldBinding';
import { createRef, useRef, useState } from 'react';
import { logger } from '@codeleap/logger';

export class ValidationError extends Error {
  data: any

  constructor(data: any) {
    super()
    this.data = data
  }
}



export class Field<
  T, 
  Validate extends Validator<T,any,any>,
  Result  = Validate extends Validator<T, infer R, any> ? R : never,
  Err  = Validate extends Validator<T, any, infer E> ? E : never
> {
  _type: string

  deep: boolean

  state: FieldState<T>

  properties: AnyRecord = {}

  options: FieldOptions<T, Validate>

  ref?: React.RefObject<IFieldRef<T>>

  __validationRes: ValidationResult<Result, Err>

  private initialValue: T

  static enableLogs = false

  static getProps = (field: Field<any,any>) => {
    throw new Error('Field.getProps not implemented')
  }
  
  static methodMeasurePosition = (field: Field<any,any>, wrapperRef: any): Promise<FieldMeasureResult> => {
    throw new Error('Field.measurePosition not implemented')
  }

  static methodScrollTo = (field: Field<any,any>, scrollRef: any, measure: FieldMeasureResult): Promise<void> => {
    throw new Error('Field.scrollTo not implemented')
  }

  static methodGetPadding = (field: Field<any,any>): number => {
    throw new Error('Field.getPadding not implemented')
  }

  constructor(options: FieldOptions<T, Validate>) {
    this.options = options
    this.ref = createRef()
    this.loadState()

    this.setValue = this.setValue.bind(this)
    this.use = this.use.bind(this)
    this.useBinding = this.useBinding.bind(this)

    this.properties = this.toInternalProperties(options)
  }

  get name(){
    return this.options.name
  }

  get value(){
    return this.state.get()
  }

  get isValid(){
    const res = this.validate()

    return res.isValid
  }

  private toInternalProperties(options: FieldOptions<T, Validate>) {
    const internalKeys = new Set(['name', 'defaultValue', 'state', 'validate', 'loader', 'onValueChange'])

    return Object.assign(
      { field: this },
      Object.fromEntries(Object.entries(options).filter(([key]) => !internalKeys.has(key)))
    )
  }

  attach(to: FieldState<T>) {
    const val = this.value

    this.state = to

    this.setValue(val)
  }

  setValue(to: T) {
    if (this.options.onValueChange) this.options.onValueChange(to)
    return this.state.set(to)
  }

  useValue(){
    const value = useStore(this.state)

    return value
  }

  resetValue() {
    this.setValue(this.initialValue)
  }

  use(impl?: Partial<IFieldRef<T>>, deps?: any[]){
    const value = this.useValue()    

    const validation = this.useValidation()
    
    // Yes, this is dangerous and doesn't follow the rules, but not passing an implementation to imperative handle after passing it once would break the app anyway
    if(impl) { 
      this.useBinding(impl, deps)
    }
    
    const changed = value != this.initialValue

    return {
      validation,
      value,
      setValue: this.setValue,
      changed,
      representation: this.toRepresentation(value),
      options: this.options,
    }
  }

  useBinding(...args: SecondToLastArguments<typeof useFieldBinding<T>>){
    useFieldBinding(this.ref, ...args)

  }

  changed() {
    return this.state.get() != this.initialValue
  }

  // If we make this async, the js engine will not delay further execution while the funcion is not done. This way we wait until we know wheter there's a promise or not
  loadState(){
    let defaultValuePromise: Promise<T> = undefined
    let defaultValue:T = undefined

    if(TypeGuards.isFunction(this.options.defaultValue)) {
      const v = this.options.defaultValue()

      if(TypeGuards.isPromise(v)) {
        defaultValuePromise = v
      } else {
        defaultValue = v    
      }
    } else {
      const v = this.options?.defaultValue

      if(TypeGuards.isPromise(v)) {
        defaultValuePromise = v
      } else {
        defaultValue = v    
      }
    }

    this.state = this?.options?.state ?? atom(defaultValue)

    if(!defaultValuePromise) {
      this.initialValue = defaultValue
    }

    if(!!defaultValuePromise) {
      this.log('debug', 'Waiting for initial value')

      return defaultValuePromise
        .then((v) => {
          this.state.set(v)
          this.initialValue = v
          this.log('debug', `Got initial value`, v)
        })
        .catch(e => {
          this.log('error', `Failed to resolve default value`, e)
        })
    } else {
      return Promise.resolve()
    }
  }

  formatLog(...args: any[]) {
    const [firstArgument, ...otherArgs] = args

    let PREFIX = `(FIELD: ${this.name})`
    
    if(TypeGuards.isString(firstArgument)) {
      PREFIX += ` ${firstArgument}`
    } else {
      otherArgs.unshift(firstArgument)
    }

    const logArgs = [
      PREFIX,
      ...otherArgs
    ]

    return logArgs
  }

  validate(value?: any): ValidationResult<Result, Err> {
    
    const validate = this.options.validate
    
    const valueToCheck = TypeGuards.isUndefined(value) ? this.state.get() : this.toInternalValue(value)
  
    try {
      const result = validate(valueToCheck, {})
            
      return result

    } catch(e) {
      
      if(e instanceof ValidationError) {
        return {
          isValid: false,
          error: e.data
        }
      }

      throw e
    }
    
  }

  useValidation() {
    const value = this.useValue()
    
    const isUnset = typeof value === 'undefined'

    const startedUnset = useRef(isUnset).current

    const isSet = !isUnset

    const validation = this.validate(value)

    const isValid = validation.isValid

    const isInvalid = !isValid

    const hasChanged = this.initialValue != value
    
    const message = validation.readableError ?? validation.error?.[0]?.message

    const errorDisplayRequiresBlur = startedUnset

    
    const [hasBlurred, setHasBlurred] = useState(false)

    const showError = isInvalid && (errorDisplayRequiresBlur ? hasBlurred : true)

    

    return {
      onInputBlurred(){
        setHasBlurred(true)
      },
      hasBlurred,
      hasChanged,
      startedUnset,
      isSet,
      isInvalid,
      isValid,
      message,
      showError,
      isUnset,
      validation,
      value
    }
  }

  log(level = 'log', ...args: any[]){
    if (Field.enableLogs) logger[level](...this.formatLog(...args))
  }
  
  toInternalValue(v: any) {
    return v as T
  }

  toRepresentation(v: T) {
    return v as any
  }

  props(): IFieldProps {
    return this.properties
  }

  measurePosition<T>(wrapperRef: T): Promise<FieldMeasureResult> {
    return Field.methodMeasurePosition(this, wrapperRef)
  }

  scrollTo<T>(scrollRef: T, measure: FieldMeasureResult): Promise<void>{
    return Field.methodScrollTo(this, scrollRef, measure)
  }

  getPadding(): number {
    return Field.methodGetPadding(this)
  }
}