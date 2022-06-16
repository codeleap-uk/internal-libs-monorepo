import {
  ButtonComposition,
  createDefaultVariantFactory,
  includePresets,
  ModalComposition,
  ModalStyles,
  assignTextStyle,
} from '@codeleap/common'

export const modalTransition = {
  duration: 150,
  ease: 'easeOut',
  useNativeDriver: false,
}

export type MobileModalParts =
  | 'wrapper'
  | 'overlay'
  | 'innerWrapper'
  | 'innerWrapperScroll'
  | 'box'
  | 'footer'
  | 'body'
  | 'header'
  | 'touchableBackdrop'
  | 'box:pose'
  | 'title'
  | `closeButton${Capitalize<ButtonComposition>}`

export type MobileModalComposition =
  | MobileModalParts
  | `${MobileModalParts}:visible`

const createModalStyle = createDefaultVariantFactory<MobileModalComposition>()

const presets = includePresets((style) => createModalStyle(() => ({ body: style })),
)

const defaultModalStyles = ModalStyles

export const MobileModalStyles = {
  ...defaultModalStyles,
  ...presets,
  default: createModalStyle((Theme) => {
    const fullSize = {
      ...Theme.presets.whole,
      position: 'absolute',
      width: Theme?.values?.width,
      height: Theme?.values?.height,
    }

    return {
      wrapper: {
        zIndex: 1,

        ...fullSize,
      },

      overlay: {
        opacity: 0,

        backgroundColor: Theme.colors.black,
        ...fullSize,
      },
      'overlay:visible': {
        opacity: 0.5,
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
      touchableBackdrop: {
        ...fullSize,
      },
      'box:pose': {
        opacity: 0,
        scale: 0.8,
        transition: modalTransition,
      },
      'box:pose:visible': {
        opacity: 1,
        scale: 1,
        transition: modalTransition,
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
  popup: createModalStyle((theme) => ({})),
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
