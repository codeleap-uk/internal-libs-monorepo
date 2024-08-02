import { IconLessInputBaseParts } from '../InputBase'

type OptionParts = 'wrapper' | 'label' | 'indicator' | 'indicatorInner' | 'separator'
type OptionStates = 'selected' | 'disabled' | 'selectedDisabled'

type OptionComposition = `${OptionParts}:${OptionStates}` | OptionParts

export type RadioInputComposition =
  IconLessInputBaseParts |
  `${IconLessInputBaseParts}:disabled` |
  `option${Capitalize<OptionComposition>}` |
  '__props'
