import { Atom, FieldOptions, IFieldRef, ValidationResult, Validator } from '../newtypes';
import { atom }  from 'nanostores'
import { SecondToLastArguments, TypeGuards } from '@codeleap/types';
import { formLogger } from '../logger';
import { useStore } from '@nanostores/react'
import { useFieldBinding } from './useFieldBinding';
import { createRef } from 'react';

class ValidationError extends Error {
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

  state: Atom<T>

  options: FieldOptions<T, Validate>

  ref?: React.RefObject<IFieldRef<T>>

  constructor(options: FieldOptions<T, Validate>) {
    this.options = options
    this.ref = createRef()
    this.loadState()

    this.setValue = this.setValue.bind(this)
    this.use = this.use.bind(this)
    this.useBinding = this.useBinding.bind(this)
  }

  get name(){
    return this.options.name
  }

  get value(){
    return this.state.get()
  }

  setValue(to: T) {
    return this.state.set(to)
  }

  use(...args: SecondToLastArguments<typeof useFieldBinding<T>>){
    const value = useStore(this.state)

    const validation = this.validate(value)

    
    // Yes, this is dangerous and doesn't follow the rules, but not passing an implementation to imperative handle after passing it once would break the app anyway
    if(args?.length) { 
      this.useBinding(...args)
    }
   

    return {
      validation,
      value,
      setValue: this.setValue,
      representation: this.toRepresentation(value)
    }
  }

  useBinding(...args: SecondToLastArguments<typeof useFieldBinding<T>>){
    useFieldBinding(this.ref, ...args)

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

    if(!!defaultValuePromise) {
      this.log('debug', 'Waiting for initial value')

      return defaultValuePromise
        .then((v) => {
          this.state.set(v)
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

    let PREFIX = `[FIELD: ${this.name}]`
    
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

  log(level, ...args: any[]){
    formLogger[level](...this.formatLog(...args))
  }
  
  toInternalValue(v: any) {
    return v as T
  }

  toRepresentation(v: T) {
    return v as any
  }
}