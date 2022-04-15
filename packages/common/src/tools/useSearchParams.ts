import { useEffect, useRef, useState } from 'react'

type UseSearchParamsReturn<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  () => void,
  URLSearchParams
]

export function useSearchParams<
  T extends Record<string, string> = Record<string, string>
>(initial?: T): UseSearchParamsReturn<T> {
  const searchParams = useRef(new URLSearchParams(typeof window === 'undefined' ? '' : location.search))
  const [params, setParams] = useState<T>(() => {

    const initialParams = Object.fromEntries(searchParams.current as any) as T

    for (const key in initial) {
      if (initialParams[key] === '' || typeof initialParams[key] === 'undefined') {
        initialParams[key] = initial[key]
      }
    }

    return initialParams
  })

  useEffect(() => {
    if (window.history) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) {
          searchParams.current.set(k, v)
        } else {
          searchParams.current.delete(k)
        }
      })

      const url =
        window.location.origin +
        window.location.pathname +
        `?${searchParams.current?.toString()}`
      window.history.replaceState({ path: url }, '', url)
    }
  }, [params])

  function reset() {
    setParams(initial)
  }

  return [params, setParams, reset, searchParams.current]
}
