import { useState, useCallback } from 'react'

const initialState = {
  message: '',
  isValid: true,
}

export const useActionValidate = (validator: any) => {
  const [error, setError] = useState(initialState)

  const validate = useCallback((value: number) => {
    if (!validator) return

    const { valid, message } = validator(value, {})

    setError({
      isValid: valid,
      message: message,
    })
  }, [validator])

  return {
    onAction: validate,
    message: error?.message,
    isValid: error?.isValid
  }
}
