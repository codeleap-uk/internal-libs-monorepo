import {
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
    }
  }),
}
