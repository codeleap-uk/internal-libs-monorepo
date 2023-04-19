import { createDefaultVariantFactory, includePresets } from "@codeleap/common";
import { ViewComposition } from "../View";

export type OverlayComposition = ViewComposition

const createOverlayStyle = createDefaultVariantFactory<OverlayComposition>()

export const OverlayPresets = includePresets((styles) => createOverlayStyle(() => ({ wrapper: styles })))