import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type AlertParts = 'body' | 'buttons' | 'button'
export type AlertComposition = AlertParts

const createAlertStyle = createDefaultVariantFactory<AlertComposition>()

export const AlertPresets = includePresets((style) => createAlertStyle(() => ({ body: style })))
