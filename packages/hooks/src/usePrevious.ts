import { useEffect, useRef } from 'react'

/**
 * Hook that returns the previous value of a variable.
 * The value is updated after render is committed to the DOM.
 *
 * @example
 * const [count, setCount] = useState(0)
 * const prevCount = usePrevious(count)
 * // On first render: count=0, prevCount=null
 * // After setCount(1): count=1, prevCount=0
 */
export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>(null)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
