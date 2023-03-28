import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ModalComposition } from '../Modal'

export type DrawerComposition = ModalComposition

const createModalStyle = createDefaultVariantFactory<DrawerComposition>()

export const DrawerPresets = includePresets((style) => createModalStyle(() => ({ body: style })))
