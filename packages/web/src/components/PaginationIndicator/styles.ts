import { ActivityIndicatorComposition } from '../ActivityIndicator'

export type PaginationIndicatorComposition = 'text' | `loader${Capitalize<ActivityIndicatorComposition>}` | 'wrapper'
