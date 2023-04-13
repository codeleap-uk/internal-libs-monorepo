import { createDefaultVariantFactory, includePresets } from "@codeleap/common";
import { ViewComposition } from "../View";

export type ScrollCompostion = ViewComposition

const createScrollStyle = createDefaultVariantFactory<ScrollCompostion>()

export const ScrollPresets = includePresets((styles) => createScrollStyle(() => ({ wrapper: styles })))