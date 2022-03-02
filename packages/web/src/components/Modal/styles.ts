import {
  assignTextStyle,
  createDefaultVariantFactory,
  ModalComposition,
  ModalStyles,
} from '@codeleap/common'

const createModalStyle = createDefaultVariantFactory<ModalComposition>()

const transitionDuration = '0.3s'

export const WebModalStyles = {
  ...ModalStyles,
  default: createModalStyle((theme) => {
    const defaultStyles = ModalStyles.default(theme)

    return {
      ...defaultStyles,
      wrapper: {
        ...defaultStyles.wrapper,
        transition: `visibility 0.01s ease`,
        transitionDelay: transitionDuration,
        '& .content': {
          transform: 'scale(0)',
          transition: `transform ${transitionDuration} ease`,
        },
        '&.visible': {
          visibility: 'visible',
          transitionDelay: '0s',
        },
        '&.visible .content': {
          visibility: 'visible',
          transform: 'scale(1)',
        },
        '&.visible .overlay': {
          opacity: 0.5,
        },
      },
      box: {
        ...defaultStyles.box,
        width: '45vw',
      },
      overlay: {
        ...defaultStyles.overlay,

        transition: `opacity ${transitionDuration} ease`,
      },

      title: {
        ...assignTextStyle('h3')(theme).text,
        ...theme.spacing.marginBottom(1),
      },

    }
  }),
  OSAlert: createModalStyle((theme) => {
    const defaults = ModalStyles.default(theme)
    return {
      ...defaults,
      body: {
        ...defaults.body,
        ...theme.presets.column,
        ...theme.presets.alignCenter,
        ...theme.presets.justifyCenter,
        ...theme.spacing.padding(2),
      },
      footer: {
        ...defaults.footer,
        ...theme.presets.row,
        ...theme.presets.justifyEnd,
        ...theme.spacing.padding(1),
        ...theme.spacing.gap(2),
      },
    }
  }),
}
