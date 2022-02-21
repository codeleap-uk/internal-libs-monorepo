import { assignTextStyle } from './Text'
import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ModalComposition =
  | 'wrapper'
  | 'overlay'
  | 'box'
  | 'body'
  | 'header'
  | 'footer';

const createModalStyle = createDefaultVariantFactory<ModalComposition>()

const presets = includePresets((styles) => createModalStyle(() => ({ wrapper: styles })),
)

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

      zIndex: 2,
    },
    box: {
      background: 'white',
      alignSelf: 'center',
      flexDirection: 'column',
      ...theme.spacing.padding(2),
    },
    overlay: {
      zIndex: -1,
      transition: `opacity ${transitionDuration} ease`,
    },
    body: {
      flexDirection: 'column',
      flex: 1,
      overflowY: 'auto',
    },
    header: {
      background: 'transparent',
      color: theme.colors.primary,
      ...theme.presets.justifySpaceBetween,
    },
    footer: {
      background: 'transparent',
    },
    title: {
      ...assignTextStyle('h3')(theme).text,
      ...theme.spacing.marginBottom(1),
    },
  })),
  roundish: createModalStyle((theme) => ({
    box: {
      borderRadius: theme.borderRadius.small,
    },
  })),
  dynamicHandler: createModalStyle(
    (theme, variant) => {
      const styles = {}
      for (const style of variant.split(';')) {
        const [shorthand, value] = style.split('-')
        const property = shorthand === 'w' ? 'width' : 'height'
        styles[property] = value
      }

      return {
        box: styles,
      }
    },
    { dynamic: true },
  ),
  fullscreen: createModalStyle((theme) => ({
    innerWrapper: {
      backgroundColor: theme.colors.background,
    },
    box: {
      flex: 1,
      width: '100%',
      borderRadius: 0,
      height: theme.values.height,
      ...theme.presets.center,
    },
  })),
}
