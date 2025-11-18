import { deepEqual } from '@codeleap/utils'
import { useState, useEffect } from 'react'

type Options<T, D> = {
  areEqual?: (currentState: T, derivedValue: D) => boolean
  transform?: (value: D | T) => any
  getValue?: (derivedValue: D) => T
}

/**
 * Hook that creates a state that synchronizes with a derived value, with customizable equality check.
 *
 * @example
 * const [state, setState] = useDerivedState(props.value, {
 *   getValue: (v) => v.id,
 *   areEqual: (a, b) => a === b.id
 * })
 */
export const useDerivedState = <T, D = T>(
  derivedValue: D,
  options: Options<T, D> = {},
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const {
    getValue = (value: any) => value as T,
    transform = (value) => value,
    areEqual = (currentState, derivedValue) => deepEqual(currentState, derivedValue),
  } = options

  const [state, setState] = useState<T>(() => getValue(derivedValue))

  useEffect(() => {
    const newValue = getValue(derivedValue)

    const stateAreEqual = areEqual(transform(state), transform(derivedValue))

    if (!stateAreEqual) {
      setState(newValue)
    }
  }, [derivedValue])

  return [state, setState]
}
