import {
  assignTextStyle,
  createDefaultVariantFactory,
  includePresets,
} from '@codeleap/common'
import { ActionIconComposition } from '../ActionIcon'

export type AnimatableParts = 'box' | 'backdrop'

export type ModalParts =
  | AnimatableParts
  | 'wrapper'
  | 'innerWrapper'
  | 'scrollContent'
  | 'scroll'
  | 'body'
  | 'footer'
  | 'header'
  | 'backdropTouchable'
  | 'title'
  | `closeButton${Capitalize<ActionIconComposition>}`

export type ModalComposition =
  | ModalParts
  | `${AnimatableParts}:visible`
  | `${AnimatableParts}:hidden`
  | `${AnimatableParts}:transition`

const createModalStyle = createDefaultVariantFactory<ModalComposition>()

const presets = includePresets((style) => createModalStyle(() => ({ body: style })))

export const ModalStyles = {
  ...presets,
  default: createModalStyle((theme) => {
    return {
      wrapper: {
        ...theme.presets.absolute,
        // ...theme.presets.whole,
        ...theme.presets.fullHeight,
        ...theme.presets.fullWidth,
      },
      'box:transition': {
        scale: {
          duration: theme.values.transitions.modal.duration,
          type: 'timing',
        },
        opacity: {
          duration: theme.values.transitions.modal.duration,
          type: 'timing',
        },
      },
      'backdrop:transition': {
        opacity: {
          duration: theme.values.transitions.modal.duration,
          type: 'timing',
        },
      },
      backdrop: {
        ...theme.presets.absolute,
        ...theme.presets.whole,

        backgroundColor: theme.colors.black,

      },
      backdropTouchable: {
        // height: '100%',
        ...theme.presets.absolute,
        ...theme.presets.whole,

      },
      'backdrop:visible': {
        opacity: 0.5,
      },
      'backdrop:hidden': {
        opacity: 0,
      },
      innerWrapper: {

      },
      scroll: {
        flex: 1,
        // maxHeight: theme.values.height,
      },
      scrollContent: {
        ...theme.presets.alignCenter,
        ...theme.presets.justifyCenter,
        minHeight: '100%',
        ...theme.presets.safeAreaTop(theme.values.innerSpacing.Y),
        ...theme.presets.safeAreaBottom(theme.values.innerSpacing.Y),
      },
      box: {
        backgroundColor: theme.colors.background,
        width: theme.values.width - theme.spacing.value(theme.values.innerSpacing.X * 2),
        borderRadius: theme.borderRadius.modalOuter,
        ...theme.spacing.paddingHorizontal(theme.values.innerSpacing.X),
        ...theme.spacing.paddingVertical(theme.values.innerSpacing.Y),
      },

      'box:hidden': {
        opacity: 0,
        scale: 0.8,

      },
      'box:visible': {
        opacity: 1,
        scale: 1,
      },
      header: {
        flexDirection: 'row',
        ...theme.presets.justifySpaceBetween,
        ...theme.presets.alignCenter,
        ...theme.spacing.marginBottom(1),
      },
      closeButtonTouchableWrapper: {
        alignSelf: 'center',
        ...theme.spacing.marginLeft('auto'),
      },
      closeButtonIcon: {
        color: theme.colors.text,
      },
      title: {
        ...assignTextStyle('h3')(theme).text,
      },
    }
  }),
  popup: createModalStyle(() => ({})),
  fullscreen: createModalStyle((theme) => ({
    overlay: {
      backgroundColor: theme.colors.background,
    },
    'overlay:visible': {
      opacity: 1,
    },
    box: {
      flex: 1,
      borderRadius: 0,
      width: theme.values.width,
      height: theme.values.window.height,
      ...theme.presets.center,
    },
  })),
}
