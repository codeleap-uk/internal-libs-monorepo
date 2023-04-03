import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { onMount, onUpdate } from '../../utils'
import { ValidatorFunctionWithoutForm } from './types'
import { getValidator, yup } from '../..'



const emptyValues = ['', null, undefined]


export function useValidate(value: any, validator: yup.SchemaOf<any> | ValidatorFunctionWithoutForm){

  const isEmpty = emptyValues.includes(value)

  const [message, setMessage] = useState<ReactNode>('')
  const [isValid, setIsValid] = useState<boolean>(true)
  const updateErrorOnChange = useRef(false)

  const _validator = useMemo(() => getValidator(validator), [])

  onUpdate(() => {
    if(!updateErrorOnChange.current) return

    const {valid, message} = _validator(value, {})

    setIsValid(valid)
    setMessage(message)
  }, [value])

  return {
    onInputBlurred: () => {
      updateErrorOnChange.current = false
      const {valid, message} = _validator(value, {})

      setIsValid(valid)
      setMessage(message)

    },
    onInputFocused: () => {
      if(isValid || isEmpty) return
      updateErrorOnChange.current = true
    },
    message,
    isValid,

  }

}

