import { useEffect, useMemo, useRef, useState } from 'react'
import { attachMediaListener, isMediaQuery } from '../tools'

export interface UseMediaQueryOptions {
  getInitialValueInEffect?: boolean
  initialValue?: boolean
}

export function useMediaQuery(query: string) {
  const mediaQuery = useMemo(() => {
    if (!query) return ''
    return query?.trim()?.replace('@media screen and ', '')
  }, [query])

  const [matches, setMatches] = useState(isMediaQuery(query))

  const queryRef = useRef<MediaQueryList>()

  useEffect(() => {
    if (query?.trim() === '' || !query) return

    if ('matchMedia' in window) {
      queryRef.current = window.matchMedia(mediaQuery)
      setMatches(queryRef.current.matches)
      return attachMediaListener(queryRef.current, (event) => setMatches(event.matches))
    }

    return undefined
  }, [mediaQuery])

  return matches
}
