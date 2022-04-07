import { useRef, useState } from 'react'
import { onMount, onUpdate } from '../../utils'
import { ValidatorFunctionWithoutForm } from './types'

export function useValidate(
  value,
  validate: ValidatorFunctionWithoutForm | string,
) {
  const [error, setError] = useState<ReturnType<ValidatorFunctionWithoutForm>>({
    valid: true,
    message: '',
  })

  const mounted = useRef(false)

  onUpdate(() => {
    const result =
    typeof validate === 'function'
      ? validate(value)
      : { message: validate, valid: false }
    setError(result)
  }, [value, validate])

  const showError = !error.valid && !!error.message && mounted.current
  onMount(() => {
    if (!mounted.current) {
      mounted.current = true
    }
  })

  return {
    showError,
    error,
    setError,
  }
}
