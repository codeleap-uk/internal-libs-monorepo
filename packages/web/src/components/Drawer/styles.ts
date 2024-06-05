import { ActionIconComposition } from '../ActionIcon'

export type DrawerComposition =
  | 'wrapper'
  | 'overlay'
  | 'header'
  | 'footer'
  | `closeButton${Capitalize<ActionIconComposition>}`
  | 'body'
  | 'box'
  | 'title'

