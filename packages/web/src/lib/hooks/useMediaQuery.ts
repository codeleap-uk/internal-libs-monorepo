import { useEffect, useMemo, useRef, useState } from 'react'
import { attachMediaListener, isMediaQuery } from '../hooks'

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
    return query.trim().replace('@media screen and ', '')
  }, [query])

  const [matches, setMatches] = useState(
    getInitialValueInEffect ? initialValue : isMediaQuery(query, initialValue),
  )

  const queryRef = useRef<MediaQueryList>()

  useEffect(() => {
    if (query.trim() === '') return

    if ('matchMedia' in window) {
      queryRef.current = window.matchMedia(_query)
      setMatches(queryRef.current.matches)
      return attachMediaListener(queryRef.current, (event) => setMatches(event.matches))
    }

    return undefined
  }, [_query])

  return matches
}
