import { ViewComposition } from '../View'

type ListStates = 'empty' | 'loading'

export type ListParts =
  ViewComposition |
  'innerWrapper' |
  'separator' |
  'refreshControl' |
  'refreshControlIndicator'

export type ListComposition = `${ListParts}:${ListStates}` | ListParts
