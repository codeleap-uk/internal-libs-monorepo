import { useEffect, useRef, useState } from 'react'
import { attachMediaListener, getMediaQuery, isMediaQuery } from '../tools'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(isMediaQuery(query))

  const queryRef = useRef<MediaQueryList>(undefined)

  useEffect(() => {
    if (query?.trim() === '' || !query) return

    if ('matchMedia' in window) {
      queryRef.current = window.matchMedia(getMediaQuery(query))
      setMatches(queryRef.current.matches)
      return attachMediaListener(queryRef.current, (event) => setMatches(event.matches))
    }

    return undefined
  }, [])

  return matches
}
