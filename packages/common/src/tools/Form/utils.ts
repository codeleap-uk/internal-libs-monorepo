import { useState } from 'react'
import { onUpdate } from '../../utils'
import { ValidatorFunction } from './types'

export function useValidate(value, validate:ValidatorFunction|string){
  const [error, setError] = useState<ReturnType<ValidatorFunction>>({
    valid: true,
    message: '',
  })
  onUpdate(() => {
  
      
    const result = typeof validate === 'function' ? 
      validate(value) : 
      {message: validate, valid: false}
    setError(result)
       
       
  }, [value, validate])

  const showError = (!error.valid  && !!error.message)

  return {
    showError,
    error,
    setError,
       
  }
}
