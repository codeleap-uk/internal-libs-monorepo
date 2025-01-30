import { TypeGuards } from '@codeleap/types'
import { ensureHttps } from '@codeleap/utils'

export function isYoutubeVideo(uri: string) {
  return uri.includes('youtube')
}

const youtubeIDLength = 11

export function getYouTubeId(url: string) {
  if (typeof url !== 'string' || url?.length <= youtubeIDLength) return null
  if (!isYoutubeVideo(url)) return null

  let videoId = null

  url = ensureHttps(url)

  try {
    const _url = new URL(url)
    const pathParts = _url.pathname.split('/')

    const path = pathParts[pathParts.length - 1]

    videoId = path?.length == youtubeIDLength ? path : null

    if (TypeGuards.isNull(videoId)) {
      const searchParams = _url?.searchParams

      const idSearchParam = searchParams.get('v')

      videoId = idSearchParam?.length === youtubeIDLength ? idSearchParam : null
    }
  } catch (err) { }

  return videoId
}
