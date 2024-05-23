type MediaQueryCallback = (event: { matches: boolean; media: string }) => void

/**
 * Older versions of Safari (shipped withCatalina and before) do not support addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
 * */
export function attachMediaListener(query: MediaQueryList, callback: MediaQueryCallback) {
  try {
    query.addEventListener('change', callback)
    return () => query.removeEventListener('change', callback)
  } catch (e) {
    query.addListener(callback)
    return () => query.removeListener(callback)
  }
}

export function isMediaQuery(query: string, initialValue = false) {
  const media = query.trim().replace('@media screen and ', '')

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    return window.matchMedia(media).matches
  }

  return initialValue
}
