import { GridComposition, GridPresets } from '@codeleap/web'
import { variantProvider } from '../theme'

const createGridStyle = variantProvider.createVariantFactory<GridComposition>()

const defaultStyles = GridPresets

const gridVariables = {
  minHeight: 550,
}

export const AppGridStyles = {
  ...defaultStyles,
  default: createGridStyle((theme) => {
    return {
      ...defaultStyles,
      wrapper: {
        display: 'flex',
        ...theme.presets.full,
        ...theme.presets.column,
        ...theme.presets.center,
      },
      innerWrapper: {
        minHeight: gridVariables.minHeight,
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
        ...theme.presets.fullWidth,
        ...theme.presets.absolute,
        top: 0,
        left: 0,
        display: 'flex',
        ...theme.presets.column,
      },
      column: {
        display: 'flex',
        ...theme.presets.row,
        gap: theme.spacing.value(1),
      },
      refreshControl: { 
        backgroundColor: theme.colors.neutral1, 
        borderRadius: theme.borderRadius.rounded,
        zIndex: 2,
        ...theme.presets.absolute,
        left: '50%', 
        transform: 'translateX(-50%)',
        ...theme.spacing.padding(0.5),
        pointerEvents: 'none',
      },
    }
  }),
  hiddenSeparator: createGridStyle(theme => ({
    separator: {
      ...theme.presets.fullWidth,
      height: theme.values.innerSpacing.value,
    },
  })),
  lineSeparators: createGridStyle(theme => ({
    separator: {
      height: theme.values.pixel,
      backgroundColor: theme.colors.neutral5,
    },
  })),
}
