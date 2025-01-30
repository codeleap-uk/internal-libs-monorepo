import React from 'react'
import PlayerYoutube from 'react-native-youtube-iframe'
import { getYouTubeId, isYoutubeVideo } from './utils'
import { IJSX, StyledComponentProps } from '@codeleap/styles'
import { AnyRecord } from '@codeleap/types'
import { MobileStyleRegistry } from '../../Registry'
import { YoutubePlayerProps } from './types'
import { VideoPlayer } from '../VideoPlayer'
import { useStylesFor } from '../../hooks'

export * from './types'
export * from './utils'
export * from './styles'

export const YoutubePlayer = (youtubePlayerProps: YoutubePlayerProps) => {
  const { uri, style, ...props } = {
    ...YoutubePlayer.defaultProps,
    ...youtubePlayerProps,
  }

  const styles = useStylesFor(YoutubePlayer.styleRegistryName, style)
  const videoId = getYouTubeId(uri)

  if (!videoId) return null
  if (!isYoutubeVideo(uri)) return <VideoPlayer uri={uri} />
  return <PlayerYoutube {...props} videoId={videoId} play={true} webViewStyle={styles.wrapper}/>
}

YoutubePlayer.styleRegistryName = 'YoutubePlayer'
YoutubePlayer.elements = ['wrapper']
YoutubePlayer.rootElement = 'wrapper'

YoutubePlayer.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return YoutubePlayer as (props: StyledComponentProps<YoutubePlayerProps, typeof styles>) => IJSX
}

YoutubePlayer.defaultProps = {
  closable: false,
  repeat: true,
} as Partial<YoutubePlayerProps>

MobileStyleRegistry.registerComponent(YoutubePlayer)
