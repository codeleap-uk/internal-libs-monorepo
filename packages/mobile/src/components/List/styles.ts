import { ScrollComposition } from '../Scroll/styles'

type ListStates = 'empty' | 'loading' 

type ListParts = ScrollComposition | 'separator' | 'header' | 'refreshControl'

export type ListComposition = `${ListParts}:${ListStates}` | ListParts
