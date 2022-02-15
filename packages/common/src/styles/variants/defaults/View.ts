import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ViewComposition = 'wrapper';

const createViewStyle = createDefaultVariantFactory<ViewComposition>()

const presets = includePresets((styles) => createViewStyle(() => ({ wrapper: styles })),
)

export const ViewStyles = {
  ...presets,
  default: createViewStyle((t) => ({
    // wrapper: {
    //   display: 'flex',
    // },
  })),
  separator: createViewStyle((t) => ({
    wrapper: {
      width: '100%',
      height: t.values.pixel,
      backgroundColor: t.colors.borders,
      marginLeft: t.spacing.value(3),
    },
  })),
}
