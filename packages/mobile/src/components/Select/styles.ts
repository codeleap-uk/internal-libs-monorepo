import { assignTextStyle, ButtonParts, createDefaultVariantFactory, TextInputComposition } from '@codeleap/common'

type ModalParts = 
  'Box' |
  'Wrapper' |
  'Header' |
  'Footer' |
  'List' |
  'Item' |
  'ItemText' |
  'Item:selected' |
  'LabelText' |
  `CloseButton${Capitalize<ButtonParts>}`

type InputParts = `input${Capitalize<TextInputComposition>}` 

export type MobileSelectParts = InputParts 
| `backdrop` 
| `backdrop:visible` 
| `backdrop:hidden` 
| `modal${ModalParts}`

export type MobileSelectComposition = MobileSelectParts

const createSelectStyle = createDefaultVariantFactory<MobileSelectComposition>()

export const MobileSelectStyles = {
  default: createSelectStyle((theme) => ({
    modalBox: {
      backgroundColor: theme.colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      zIndex: 1,
      elevation: 5,
    },
    modalWrapper: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'flex-end',
    },
    modalItem: {
      ...theme.spacing.paddingVertical(1),
      ...theme.spacing.paddingHorizontal(2),
      color: theme.colors.text,
    },
    'modalItem:selected': {
      color: theme.colors.primary,
    },
    modalList: {
      ...theme.spacing.marginVertical(0.6),
    },
    backdrop: {
      zIndex: 10,
      flex: 1,
      backgroundColor: '#000',
    },
    'backdrop:hidden': {
      opacity: 0,
    },
    'backdrop:visible': {
      opacity: 0.4,
    },
    modalHeader: {
      ...theme.spacing.padding(2),
      flexDirection: 'row',
      ...theme.presets.alignCenter,
      ...theme.presets.justifySpaceBetween,
    },
    modalLabelText: {
      ...assignTextStyle('p2')(theme).text,
    },
    modalCloseButtonWrapper: {
      backgroundColor: 'transparent',
    },
  })),
}
