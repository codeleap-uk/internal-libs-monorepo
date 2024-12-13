import { z, ZodIssue } from 'zod'
import { ValidationResult } from '../newtypes'
import { TypeGuards } from '@codeleap/types'

type ZodValidationResult<T extends z.ZodType> = ValidationResult<z.infer<T>, z.ZodError['issues']>

export function zodValidator<T extends z.ZodType>(model: T) {
  return (value): ZodValidationResult<T> => {
    const result = model.safeParse(value)
    
    return {
      isValid: result.success,
      error: result.error?.issues,
      result: result.data      
    }
  }
}


const isZodIssue = (val: any): val is ZodIssue => {
  return ['code','expected','received','path','message'].every(x => x in val)
}

export function isZodValidationResult(val: any): val is ZodValidationResult<any> {
  const isValidABoolean = TypeGuards.isBoolean(val.isValid)

  if(isValidABoolean) {
    if(!val.isValid) {
      return TypeGuards.isArray(val.error) && val.error.every(isZodIssue)
    } else {
      return 'result' in val
    }
  }

  return false
 
}