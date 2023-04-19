import { createDefaultVariantFactory, includePresets } from "@codeleap/common";
import { ModalComposition } from "../Modal";

export type DrawerComposition = ModalComposition

const createDrawerStyle = createDefaultVariantFactory<DrawerComposition>()

export const DrawerPresets = includePresets((styles) => createDrawerStyle(() => ({ wrapper: styles })))