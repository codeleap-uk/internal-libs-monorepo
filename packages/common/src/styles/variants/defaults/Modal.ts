import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ModalComposition = 'wrapper'| 'overlay' | 'box' | 'body' | 'header' | 'footer';

const createModalStyle = createDefaultVariantFactory<ModalComposition>()

const presets = includePresets((styles) => createModalStyle(() => ({ wrapper: styles })))

const transitionDuration = '0.3s'

export const ModalStyles = {
  ...presets,

  default: createModalStyle((theme) => ({
    wrapper: {
      position: 'fixed',
      display: 'flex',
      justifyContent: 'center',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      visibility: 'hidden',
      transition: `visibility 0.01s ease`,
      transitionDelay: transitionDuration,
      zIndex: 2,
      '&.visible': {
        visibility: 'visible',
        transitionDelay: '0s',
      },
      '&.visible .content': {
        transform: 'scale(1)',
      },
      '&.visible .overlay': {
        opacity: 0.5,
      },
    },
    box: {
      transform: 'scale(0)',
      transition: `transform ${transitionDuration} ease`,
      background: 'white',
      width: '45vw',
      alignSelf: 'center',
     
      flexDirection: 'column',
    },
    overlay: {
      background: theme.colors.black,
      opacity: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      position: 'absolute',
      transition: `opacity ${transitionDuration} ease`,
    },
    body: {
      ...theme.spacing.padding(1),
      flexDirection: 'column',
      flex: 1,
      overflowY: 'auto',
    },
    header: {
      background: 'transparent',
      color: theme.colors.primary,
      ...theme.presets.justifySpaceBetween,
      ...theme.spacing.padding(1),
    },
    footer: {
      background: 'transparent',
      ...theme.spacing.padding(1),
    },
  })),
  roundish: createModalStyle((theme) => ({
    box: {
      borderRadius: theme.borderRadius.small,
    },
  })),
  dynamicHandler: createModalStyle((theme, variant) => {
    const styles = {}
    for (const style of variant.split(';')){
      const [shorthand, value] = style.split('-')
      const property = shorthand  === 'w' ? 'width': 'height'
      styles[property] = value
    }
    
    return {
      box: styles,
    }
  }, { dynamic: true }),
}

