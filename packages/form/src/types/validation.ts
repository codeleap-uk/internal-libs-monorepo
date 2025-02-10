export type ValidationResult<Result, Err> = {
  isValid: boolean
  result?: Result
  error?: Err
  readableError?: string
} 

export type ValidatorFunction<Value, Result, Err> = (value: Value, form: any) => ValidationResult<Result, Err> 

export type Validator<Value, Result, Err> = ValidatorFunction<Value, Result, Err>