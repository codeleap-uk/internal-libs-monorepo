import { useEffect, useRef } from 'react'

/**
 * Hook that creates a ref that automatically updates when a derived value changes.
 *
 * @example
 * const userNameRef = useDerivedRef(user, (u) => u.name)
 * // userNameRef.current will always contain the latest user name
 */
export const useDerivedRef = <T, D>(
  derivedValue: D,
  getValue: (derivedValue: D) => T,
): React.MutableRefObject<T> => {
  const ref = useRef(getValue(derivedValue))

  useEffect(() => {
    ref.current = getValue(derivedValue)
  }, [derivedValue])

  return ref
}
