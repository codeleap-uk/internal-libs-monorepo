import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ModalComposition = 'text' | 'inner' |'wrapper' | 'icon' | 'loader';

const createModalStyle = createDefaultVariantFactory<ModalComposition>()

const presets = includePresets((styles) => createModalStyle(() => ({ wrapper: styles })))

export const ModalStyles = {
  ...presets,
  default: createModalStyle((theme) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.spacing.padding(1),
    },
  })),
  circle: createModalStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(2),
    },
    text: {
      color: 'yellow',
    },
  })),
  pill: createModalStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius,
    },
  })),

}
