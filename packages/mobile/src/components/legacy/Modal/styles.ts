import {
  ButtonComposition,
  createDefaultVariantFactory,
  includePresets,
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

const presets = includePresets((style) => createModalStyle(() => ({ body: style })))

const defaultModalStyles = ModalStyles

export const MobileModalStyles = {
  ...defaultModalStyles,
  ...presets,
  default: createModalStyle((theme) => {
    const fullSize = {
      ...theme.presets.whole,
      position: 'absolute',
      width: theme?.values?.width,
      height: theme?.values?.height,
    }

    return {
      wrapper: {
        zIndex: 1,

        ...fullSize,
      },

      overlay: {
        opacity: 0,

        backgroundColor: theme.colors.black,
        ...fullSize,
      },
      'overlay:visible': {
        opacity: 0.5,
      },
      innerWrapper: {},
      innerWrapperScroll: {
        display: 'flex',
        alignItems: 'center',
        ...theme.presets.justifyCenter,
        minHeight: theme.values.window.height,
      },
      box: {
        width: '80%',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.medium,
        ...theme.spacing.padding(2),
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
