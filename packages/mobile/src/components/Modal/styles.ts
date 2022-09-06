import {
  assignTextStyle,
  ButtonComposition,
  createDefaultVariantFactory,
  includePresets,
} from '@codeleap/common'

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
  | `closeButton${Capitalize<ButtonComposition>}`

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
    const fullSize = {
      ...theme.presets.whole,
      position: 'absolute',
      width: theme.values.width,
      height: theme.values.height,
      maxHeight: theme.values.height,
    }

    return {
      wrapper: {
        zIndex: 1,
        height: theme.values.height,
        width: theme.values.width,
        ...theme.presets.whole,
        position: 'absolute',
        ...theme.presets.safeAreaTop(),
        paddingBottom: theme.values.bottomNavHeight,
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

        backgroundColor: theme.colors.black,
        ...fullSize,
      },
      backdropTouchable: {
        ...fullSize,
      },
      'backdrop:visible': {
        opacity: 0.5,
      },
      'backdrop:hidden': {
        opacity: 0,
      },
      innerWrapper: {
        ...theme.presets.alignCenter,
        ...theme.presets.justifyCenter,
        width: theme.values.width,
        flex: 1,
      },
      scroll: {
        width: theme.values.width,
        height: theme.values.window.height,
        maxHeight: theme.values.window.height,
      },
      scrollContent: {
        ...theme.presets.alignCenter,
        ...theme.presets.justifyCenter,
        ...theme.spacing.paddingVertical(2),
        ...theme.presets.fullWidth,
        flex: 1,
      },
      box: {
        width: '80%',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.medium,
        ...theme.spacing.padding(2),
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
      },
      closeButtonWrapper: {
        alignSelf: 'center',
        ...theme.spacing.marginLeft('auto'),
      },
      title: {
        ...theme.presets.textCenter,
        ...assignTextStyle('h3')(theme).text,
        ...theme.spacing.paddingBottom(1),
        flex: 1,
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
