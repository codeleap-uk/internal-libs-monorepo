import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type CenterWrapperComposition = 'wrapper' | 'innerWrapper';

const createCenterWrapperStyle = createDefaultVariantFactory<CenterWrapperComposition>()

const presets = includePresets((styles) => createCenterWrapperStyle(() => ({ innerWrapper: styles })))

export const CenterWrapperStyles = {
  ...presets,
  default: createCenterWrapperStyle((Theme) => ( {wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
 
    width: '100%',
  },
  innerWrapper: {
    flex: 1,
    display: 'flex',
    width: '100%',
    maxWidth: 1280,
    [Theme.media.down('xxlarge')]: {
      paddingLeft: Theme.spacing.value(16),
      paddingRight: Theme.spacing.value(16),
    },
    [Theme.media.down('large')]: {
      paddingLeft: Theme.spacing.value(12),
      paddingRight: Theme.spacing.value(12),
    },
    [Theme.media.down('largeish')]: {
      paddingLeft: Theme.spacing.value(8),
      paddingRight: Theme.spacing.value(8),
    },
    [Theme.media.down('mid')]: {
      paddingLeft: Theme.spacing.value(4),
      paddingRight: Theme.spacing.value(4),
    },
    [Theme.media.down('small')]: {
      paddingLeft: Theme.spacing.value(2),
      paddingRight: Theme.spacing.value(2),
    },
  }})),
}
