import { createDefaultVariantFactory, includePresets } from "@codeleap/common"
import { ViewComposition } from "../View"

export type CollapseComposition = ViewComposition

const createCollapseStyle = createDefaultVariantFactory<CollapseComposition>()

export const CollapsePresets = includePresets((styles) => createCollapseStyle(() => ({ wrapper: styles })))