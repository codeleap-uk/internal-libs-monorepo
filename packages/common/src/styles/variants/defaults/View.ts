import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ViewComposition = 'wrapper';

const createViewStyle = createDefaultVariantFactory<ViewComposition>()

const a = includePresets((styles) => createViewStyle(() => ({ wrapper: styles })))

export const ViewStyles = {
  ...a,
}

