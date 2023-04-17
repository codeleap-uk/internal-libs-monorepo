import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { onMount, onUpdate } from '../../utils'
import { ValidatorFunctionWithoutForm } from './types'
import { getValidator, yup } from '../..'

const emptyValues = ['', null, undefined]

export function useValidate(value: any, validator: yup.SchemaOf<any> | ValidatorFunctionWithoutForm) {

  const isEmpty = emptyValues.includes(value)

  const [_message, setMessage] = useState<ReactNode>('')
  const [isValid, setIsValid] = useState<boolean>(true)
  const updateErrorOnChange = useRef(false)

  const _validator = useMemo(() => getValidator(validator), [])

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
      
      if (isValid || isEmpty) return
      updateErrorOnChange.current = true
    },
    message: _message,
    isValid,
    showError: !isValid && !isEmpty,
    error: {
      message: _message,
    }
  }

}

