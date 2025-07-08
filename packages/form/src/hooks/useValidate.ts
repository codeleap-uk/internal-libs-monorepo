import { useCallback, useRef, useState } from 'react'
import { Validator } from '../types'
import { ValidationError } from '../lib/Field'

export const useValidate = <T, V extends Validator<T, any, any>>(value: T, providedValidate: V) => {
  const [hasBlurred, setHasBlurred] = useState(false)

  const isUnset = typeof value === 'undefined'

  const startedUnset = useRef(isUnset).current

  const validate = useCallback((value: T) => {
    try {
      const result = providedValidate?.(value, {})

      return result
    } catch (e) {
      if (e instanceof ValidationError) {
        return {
          isValid: false,
          error: e.data
        }
      }

      throw e
    }
  }, [])

  const onInputBlurred = useCallback(() => {
    setHasBlurred(true)
  }, [])

  const validation = validate(value)

  const isValid = validation?.isValid ?? true

  const isInvalid = !isValid

  const message = validation?.readableError ?? validation?.error?.[0]?.message

  const errorDisplayRequiresBlur = startedUnset

  const showError = isInvalid && (errorDisplayRequiresBlur ? hasBlurred : true)

  return {
    onInputBlurred,
    showError,
    message,
  }
}