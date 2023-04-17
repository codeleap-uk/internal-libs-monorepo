import { createDefaultVariantFactory, includePresets } from "@codeleap/common"
import { TextComposition } from "../Text"


export type LinkComposition = TextComposition



const createLinkStyle = createDefaultVariantFactory<LinkComposition>()

export const LinkPresets = includePresets((styles) => createLinkStyle(() => ({ text: styles })))
