import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ViewComposition = 'wrapper';

const createViewStyle = createDefaultVariantFactory<ViewComposition>()

const presets = includePresets((styles) => createViewStyle(() => ({ wrapper: styles })))

export const ViewStyles = {
  ...presets,
  default: createViewStyle((t) =>  ({
    wrapper: {
      display: 'flex',
    },
  })),
  scrollX: createViewStyle(() => ({
    wrapper: {
      overflowX: 'auto',
    },
  })),
  scrollY: createViewStyle(() => ({
    wrapper: {
      overflowY: 'auto',
    },
  })),
}

