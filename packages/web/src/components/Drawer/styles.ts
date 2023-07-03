import { createDefaultVariantFactory, includePresets } from "@codeleap/common"
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

const createDrawerStyle = createDefaultVariantFactory<DrawerComposition>()

export const DrawerPresets = includePresets((styles) => createDrawerStyle(() => ({ wrapper: styles })))