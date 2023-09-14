import { ModalComposition, ModalPresets } from '@codeleap/web'
import { variantProvider } from '..'
import { assignTextStyle } from './Text'

const createModalStyle = variantProvider.createVariantFactory<ModalComposition>()

const SPACING_VERTICAL = 8

export const AppModalStyles = {
  ...ModalPresets,


  default: createModalStyle((theme) => ({
    wrapper: {
      ...theme.presets.fullHeight,
      ...theme.presets.fullWidth,
      position: 'fixed',
      ...theme.presets.whole,
      zIndex: 999,
      transition: 'visibility 0.2s ease',
      animation: 'fadeIn 0.2s ease-in-out',
    },
    'wrapper:hidden': {
      visibility: 'hidden',
      pointerEvents: 'none',
    },
    'wrapper:visible': {
      visibility: 'visible',
      pointerEvents: 'auto',
    },
    innerWrapper: {
      ...theme.presets.justifyCenter,
      ...theme.presets.alignStart,
      ...theme.presets.scrollY,
      maxHeight: '100svh',
      minWidth: '100svw',
      ...theme.spacing.paddingVertical(SPACING_VERTICAL),
    },
    backdropPressable: {
      ...theme.presets.whole,
      ...theme.presets.absolute,
      zIndex: 1,
    },
    backdrop: {
      ...theme.presets.absolute,
      ...theme.presets.whole,
      backgroundColor: theme.colors.neutral10,
      zIndex: -1,
      minHeight: '100%',
      transition: 'opacity 0.2s ease-in-out',
      animation: 'opacity 0.2s ease-in-out',
    },
    'backdrop:visible': {
      opacity: 0.5,
    },
    'backdrop:hidden': {
      opacity: 0,
    },
    box: {
      backgroundColor: theme.colors.neutral1,
      maxWidth: `85dvw`,
      borderRadius: theme.borderRadius.medium,
      ...theme.presets.column,
      zIndex: 2,
      ...theme.spacing.padding(2),
      ...theme.presets.relative,
      overflow: 'hidden',
      transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
      animation: 'scaleIn 0.2s ease-in-out',
    },
    'box:hidden': {
      opacity: 0,
      transform: `scale(0.8)`,
    },
    'box:visible': {
      transform: `scale(1)`,
    },
    body: {
      ...theme.presets.column,
    },
    header: {
      ...theme.presets.column,
      ...theme.spacing.marginBottom(2),
      ...theme.presets.alignStart,
      ...theme.presets.justifySpaceBetween,
      backgroundColor: theme.colors.neutral1,
    },
    titleWrapper: {
      ...theme.presets.relative,
      ...theme.presets.fullWidth,
      ...theme.presets.row,
      ...theme.presets.center,
    },
    title: {
      ...assignTextStyle('h4')(theme).text,
      color: theme.colors.neutral10,
    },
    description: {
      ...theme.presets.fullWidth,
      textAlign: 'center',
      color: theme.colors.neutral8,
      ...theme.spacing.marginTop(1),
      ...assignTextStyle('p1')(theme).text,
    },
    footer: {
      ...theme.spacing.marginTop(2),
    },
    'closeButtonTouchableWrapper': {
      padding: theme.spacing.value(0),
      width: 'auto',
      height: 'auto',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      borderRadius: 0,
      background: theme.colors.transparent,
    },
    closeButtonIcon: {
      color: theme.colors.primary3,
      width: theme.values.iconSize[3],
      height: theme.values.iconSize[3],
    }
  })),
  fullscreen: createModalStyle((theme) => ({
    innerWrapper: {
      padding: 0,
    },
    box: {
      ...theme.presets.fullHeight,
      ...theme.presets.fullWidth,
      maxWidth: 'none',
      borderRadius: 0,
    },
    body: {
      ...theme.presets.fullHeight,
      ...theme.presets.fullWidth,
      maxHeight: `100vh`,
    },
  })),
  centered: createModalStyle((theme) => ({
    innerWrapper: {
      ...theme.presets.center,
    },
    title: {
      margin: 'auto',
    },
  })),
  scroll: createModalStyle((theme) => ({
    body: {
      overflow: 'auto',
      maxHeight: `calc(85vh - ${theme.spacing.value(SPACING_VERTICAL)}px)`,
    },
  })),
}
