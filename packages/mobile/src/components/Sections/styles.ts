import { ScrollComposition } from '../Scroll/styles'

type SectionsStates = 'empty' | 'loading' 

type SectionsParts = ScrollComposition | 'separator' | 'header' | 'refreshControl'

export type SectionsComposition = `${SectionsParts}:${SectionsStates}` | SectionsParts
