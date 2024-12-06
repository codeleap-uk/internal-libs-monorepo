import { ReactNode, useMemo, useRef, useState } from 'react'
import { onUpdate } from '@codeleap/hooks'
import { ValidatorFunctionWithoutForm } from './types'
import { getValidator } from './createForm'

import * as yup from 'yup'

const emptyValues = ['', null, undefined]

export function useValidate(value: any, validator: yup.SchemaOf<any> | ValidatorFunctionWithoutForm) {

  const isEmpty = emptyValues.includes(value)

  const [_message, setMessage] = useState<ReactNode>('')
  const [isValid, setIsValid] = useState<boolean>(true)
  const updateErrorOnChange = useRef(false)

  const _validator = useMemo(() => getValidator(validator), [validator])

  onUpdate(() => {
    if (!updateErrorOnChange.current || !_validator) return

    const { valid, message } = _validator(value, {})

    setIsValid(valid)
    setMessage(message)
  }, [value])

  return {
    onInputBlurred: () => {

      if (!_validator) return

      updateErrorOnChange.current = false
      const { valid, message } = _validator(value, {})

      setIsValid(valid)
      setMessage(message)

    },
    onInputFocused: () => {

      if (isValid) return
      updateErrorOnChange.current = true
    },
    message: _message,
    isValid,
    showError: !isValid && !isEmpty,
    error: {
      message: _message,
    },
  }

}

