import { ControlsStyles, SubtitleStyle } from 'react-native-video'
import { ActionIconComposition } from '../ActionIcon'

export type VideoPlayerComposition =
  'wrapper' |
  'player' |
  `subtitle${Capitalize<keyof SubtitleStyle>}` |
  `controls${Capitalize<keyof ControlsStyles>}` |
  `play${Capitalize<ActionIconComposition>}` |
  `close${Capitalize<ActionIconComposition>}`
