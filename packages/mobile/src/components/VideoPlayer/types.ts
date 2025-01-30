import { StyledProp } from '@codeleap/styles'
import { AnyFunction } from '@codeleap/types'
import { VideoPlayerComposition } from './styles'
import { ReactVideoProps, VideoRef } from 'react-native-video'

export type VideoPlayerRef = VideoRef

export type VideoPlayerProps = Omit<ReactVideoProps, 'source'> & {
  uri: string
  style?: StyledProp<VideoPlayerComposition>
  closable?: boolean
  onClose?: AnyFunction
}
