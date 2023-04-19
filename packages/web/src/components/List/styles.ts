import { createDefaultVariantFactory, includePresets } from "@codeleap/common";
import { ViewComposition } from "../View";

export type ListComposition = ViewComposition

const createListStyles = createDefaultVariantFactory<ListComposition>()

export const ListPresets = includePresets((styles) => createListStyles(() => ({ wrapper: styles })))