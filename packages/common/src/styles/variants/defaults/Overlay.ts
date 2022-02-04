import { optionalObject } from '../../../utils';
import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type OverlayComposition = 
 'wrapper' |
 'wrapper:pose' |
 'wrapper:visible' |
 'wrapper:visible:pose' |
 'header' |
 'title' |
 'closeButton';

const createOverlayStyle = createDefaultVariantFactory<OverlayComposition>()

const presets = includePresets((styles) => createOverlayStyle(() => ({ wrapper: styles })))

export const OverlayStyles = {
  ...presets,
  default: createOverlayStyle((theme) => ({
    wrapper: {
      
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      position: theme.IsBrowser ? 'fixed' : 'absolute',
      backgroundColor: theme.colors.black,
      ...optionalObject(theme.IsBrowser, {visibility: 'hidden'}, {}),
    },
    'wrapper:visible': {
      opacity: 0.5,
      ...optionalObject(theme.IsBrowser, {visibility: 'visible'}, {}),
    },
    closeButton: {
      marginLeft: 'auto',
    },
    header: {
      ...theme.presets.row,
      ...theme.presets.justifySpaceBetween,
    },
  })),

}
