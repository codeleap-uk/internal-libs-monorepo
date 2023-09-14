import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ModalComposition } from '@codeleap/web'
import { assignTextStyle } from './Text'

export type AlertParts = 'body' | 'actions' | 'option' | `modal${Capitalize<ModalComposition>}`
export type AlertComposition = AlertParts

const createAlertStyle = createDefaultVariantFactory<AlertComposition>()

export const AlertPresets = includePresets((style) => createAlertStyle(() => ({ body: style })))

const WIDTH = 450

export const AppAlertStyles = {
  ...AlertPresets,
  default: createAlertStyle((theme) => ({
    option: {
      ...theme.presets.fullWidth,
      ...theme.presets.flex,
    },
    body: {
      ...assignTextStyle('p1'),
      ...theme.presets.textCenter
    },
    actions: {
      ...theme.presets.fullWidth,
      ...theme.spacing.marginTop(2),
      gap: theme.spacing.value(2),
    },
    'modalBox': {
      maxWidth: WIDTH,
      minWidth: WIDTH,

      [theme.media.down('mid')]: {
        maxWidth: WIDTH * 0.7,
        minWidth: WIDTH * 0.7,
      }
    }
  })),
}
