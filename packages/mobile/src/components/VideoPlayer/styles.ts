import { ControlsStyles, SubtitleStyle } from 'react-native-video'
import { ActionIconComposition } from '../ActionIcon'

export type VideoPlayerComposition =
  'wrapper' |
  'player' |
  `subtitle${Capitalize<keyof SubtitleStyle>}` |
  `controls${Capitalize<keyof ControlsStyles>}` |
  `playIcon${Capitalize<ActionIconComposition>}` |
  `closeIcon${Capitalize<ActionIconComposition>}`
