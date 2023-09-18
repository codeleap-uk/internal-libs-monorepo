import { ListComposition, ListPresets } from '@codeleap/web'
import { variantProvider } from '../theme'

const createListStyle = variantProvider.createVariantFactory<ListComposition>()

const defaultStyles = ListPresets

const listVariables = {
  minHeight: 550,
}

export const AppListStyles = {
  ...defaultStyles,
  default: createListStyle((theme) => {
    return {
      ...defaultStyles,
      wrapper: {
        display: 'flex',
        ...theme.presets.full,
        ...theme.presets.column,
        ...theme.presets.center,
      },
      innerWrapper: {
        minHeight: listVariables.minHeight,
        overflowY: 'auto',
        contain: 'strict',
        ...theme.presets.fullWidth,
      },
      content: {
        ...theme.presets.fullWidth,
        ...theme.presets.relative,
      },
      separator: {
        ...theme.presets.fullWidth,
        height: theme.spacing.value(1),
      },
      itemWrapper: {
        display: 'flex',
        ...theme.presets.column,
        ...theme.presets.center,
      },
      refreshControl: { 
        backgroundColor: theme.colors.neutral1, 
        borderRadius: theme.borderRadius.rounded,
        zIndex: 2,
        ...theme.presets.absolute,
        left: '50%', 
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        ...theme.spacing.padding(0.5),
      },
      list: {
        ...theme.presets.absolute,
        top: 0,
        left: 0,
        ...theme.presets.fullWidth,
      }
    }
  }),
  hiddenSeparator: createListStyle(theme => ({
    separator: {
      ...theme.presets.fullWidth,
      height: theme.values.innerSpacing.value,
    },
  })),
  lineSeparators: createListStyle(theme => ({
    separator: {
      height: theme.values.pixel,
      backgroundColor: theme.colors.neutral5,
    },
  })),
}
