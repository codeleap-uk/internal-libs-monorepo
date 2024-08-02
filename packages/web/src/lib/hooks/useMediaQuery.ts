import { useEffect, useMemo, useRef, useState } from 'react'
import { attachMediaListener, isMediaQuery } from '../tools'

export interface UseMediaQueryOptions {
  getInitialValueInEffect?: boolean
  initialValue?: boolean
}

export function useMediaQuery(
  query: string,
  queryOptions: UseMediaQueryOptions = {},
) {
  const {
    initialValue = false,
    getInitialValueInEffect = true,
  } = queryOptions

  const _query = useMemo(() => {
    if (!query) return ''
    return query?.trim()?.replace('@media screen and ', '')
  }, [query])

  const [matches, setMatches] = useState(
    (getInitialValueInEffect || !query) ? initialValue : isMediaQuery(query, initialValue),
  )

  const queryRef = useRef<MediaQueryList>()

  useEffect(() => {
    if (query?.trim() === '' || !query) return

    if ('matchMedia' in window) {
      queryRef.current = window.matchMedia(_query)
      setMatches(queryRef.current.matches)
      return attachMediaListener(queryRef.current, (event) => setMatches(event.matches))
    }

    return undefined
  }, [_query])

  return matches
}
