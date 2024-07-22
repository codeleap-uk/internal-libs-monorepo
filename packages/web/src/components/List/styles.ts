
type ListStates = 'empty' | 'loading'

export type ListParts =
  'wrapper' |
  'innerWrapper' |
  'separator' |
  'refreshControl' |
  'refreshControlIndicator'

export type ListComposition = `${ListParts}:${ListStates}` | ListParts
