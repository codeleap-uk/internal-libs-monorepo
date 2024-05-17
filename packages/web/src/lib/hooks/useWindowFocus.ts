import { AnyFunction, TypeGuards, useEffect, useState } from '@codeleap/common'

type UseWindowFocusOptions = {
    onFocus?: AnyFunction
    onBlur?: AnyFunction
  }

export const useWindowFocus = (options: UseWindowFocusOptions = {}, deps: Array<any> = []): boolean => {
  const [focused, setFocused] = useState(true)

  const onFocus = () => {
    setFocused(true)
    if (TypeGuards.isFunction(options?.onFocus)) options?.onFocus()
  }

  const onBlur = () => {
    setFocused(false)
    if (TypeGuards.isFunction(options?.onBlur)) options?.onBlur()
  }

  useEffect(() => {
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
    }
  }, deps)

  return focused
}
