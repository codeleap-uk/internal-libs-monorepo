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
  | 'innerWrapperScroll'
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
  default: createModalStyle((Theme) => {
    const fullSize = {
      ...Theme.presets.whole,
      position: 'absolute',
    }

    return {
      wrapper: {
        zIndex: 1,

        ...fullSize,
      },
      'box:transition': {
        scale: {
          duration: Theme.values.transitions.modal.duration,
          type: 'timing',
        },
        opacity: {
          duration: Theme.values.transitions.modal.duration,
          type: 'timing',
        },
      },
      'backdrop:transition': {
        opacity: {
          duration: Theme.values.transitions.modal.duration,
          type: 'timing',
        },
      },
      backdrop: {

        backgroundColor: Theme.colors.black,
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
      innerWrapper: {},
      innerWrapperScroll: {
        display: 'flex',
        alignItems: 'center',
        ...Theme.presets.justifyCenter,
        minHeight: Theme.values.height,
      },
      box: {
        width: '80%',
        backgroundColor: Theme.colors.background,
        borderRadius: Theme.borderRadius.medium,
        ...Theme.spacing.padding(2),
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
        ...Theme.presets.justifySpaceBetween,
        ...Theme.presets.alignCenter,
      },
      closeButtonWrapper: {
        alignSelf: 'center',
        ...Theme.spacing.marginLeft('auto'),
      },
      title: {
        ...Theme.presets.textCenter,
        ...assignTextStyle('h3')(Theme).text,
        ...Theme.spacing.paddingBottom(1),
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
      height: theme.values.height,
      ...theme.presets.center,
    },
  })),
}
