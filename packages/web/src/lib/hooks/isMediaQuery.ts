export function isMediaQuery(query: string, initialValue = false) {
  const media = query.trim().replace('@media screen and ', '')

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    return window.matchMedia(media).matches
  }

  return initialValue
}
