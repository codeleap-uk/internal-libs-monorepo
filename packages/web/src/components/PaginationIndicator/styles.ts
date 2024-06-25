import { ActivityIndicatorComposition } from '@codeleap/common'

export type PaginationIndicatorComposition = 'text' | `loader${Capitalize<ActivityIndicatorComposition>}` | 'wrapper'
