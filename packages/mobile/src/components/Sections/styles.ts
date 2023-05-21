import { createDefaultVariantFactory, includePresets } from "@codeleap/common";
import { ListComposition } from "../List";

export type SectionsComposition = ListComposition

const createSectionStyle = createDefaultVariantFactory<SectionsComposition>()

export const SectionsPresets = includePresets(s => {
  return createSectionStyle(() => ({
    content: s,
  }))
})