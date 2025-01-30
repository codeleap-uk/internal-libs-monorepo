import { StyledProp } from '@codeleap/styles'
import { YoutubeIframeProps } from 'react-native-youtube-iframe'
import { YoutubePlayerComposition } from './styles'

export type YoutubePlayerProps = Omit<YoutubeIframeProps, 'videoId' > & {
  style?: StyledProp<YoutubePlayerComposition>
  uri: string
}
