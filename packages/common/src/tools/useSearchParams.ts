import { useEffect, useRef, useState } from 'react'

type UseSearchParamsReturn<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export function useSearchParams<
  T extends Record<string, string> = Record<string, string>
>(initial?: T): UseSearchParamsReturn<T> {
  const searchParams = useRef(new URLSearchParams(location.search))
  const [params, setParams] = useState<T>(() => {
    if (initial) return initial

    return Object.fromEntries(searchParams.current as any) as T
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
        `?${searchParams.current.toString()}`
      window.history.replaceState({ path: url }, '', url)
    }
  }, [params])

  return [params, setParams]
}
