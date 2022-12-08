import { assignTextStyle, createDefaultVariantFactory } from '@codeleap/common'
import { SelectComposition, SelectStyles } from '../Select'
import { TextInputComposition } from '../TextInput'

export type AutoCompleteComposition = SelectComposition | `searchInput${Capitalize<TextInputComposition>}` | 'titleWrapper'

const createAutoCompleteStyle = createDefaultVariantFactory<AutoCompleteComposition>()

export const AutoCompleteStyles = {
  ...SelectStyles,
  default: createAutoCompleteStyle((theme) => {

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

      closeButtonTouchableWrapper: {
        alignSelf: 'center',
        ...theme.spacing.marginLeft('auto'),
      },
      closeButtonIcon: {
        color: theme.colors.text,
      },

      listWrapper: {
        height: 'auto',
      },

      itemWrapper: {
        ...theme.presets.row,
        ...theme.presets.justifySpaceBetween,
        ...theme.presets.alignCenter,
        borderRadius: theme.borderRadius.medium,
        ...theme.spacing.padding(1),
        backgroundColor: theme.colors.backgroundSecondary,
      },
      'itemWrapper:selected': {
        backgroundColor: theme.colors.primary,
      },
      'itemIcon:selected': {
        color: theme.colors.backgroundSecondary,
        ...theme.sized(2),

      },
      'itemText:selected': {
        color: theme.colors.backgroundSecondary,

      },
      itemIcon: {
        height: 0,
        width: 0,
      },
      header: {
        ...theme.spacing.paddingHorizontal(2),
        ...theme.spacing.paddingTop(1),
        ...theme.presets.column,
        ...theme.presets.alignStart,
      },
      searchInputWrapper: {
        ...theme.presets.fullWidth,
        ...theme.spacing.marginTop(2),
      },
      titleWrapper: {
        ...theme.presets.row,
        ...theme.presets.alignCenter,
        ...theme.presets.fullWidth,
        ...theme.presets.justifyCenter,
      },
      title: {
        ...theme.presets.textCenter,
        ...assignTextStyle('h3')(theme).text,
        flex: 1,
      },
      closeButtonWrapper: {
        position: 'absolute',
        right: 0,
      },
    }
  }),
}
