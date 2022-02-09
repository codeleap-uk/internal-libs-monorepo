import { useState } from 'react'
import { onUpdate } from '../../utils'
import { ValidatorFunctionWithoutForm } from './types'

export function useValidate(value, validate:ValidatorFunctionWithoutForm|string){
  const [error, setError] = useState<ReturnType<ValidatorFunctionWithoutForm>>({
    valid: true,
    message: '',
  })
  onUpdate(() => {
    if (value){
      const result = typeof validate === 'function' ? 
        validate(value) : 
        {message: validate, valid: false}
      setError(result) 
    }
  }, [value, validate])

  const showError = (!error.valid  && !!error.message)

  return {
    showError,
    error,
    setError,
       
  }
}
