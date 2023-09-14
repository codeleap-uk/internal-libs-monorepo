import { SelectComposition, SelectPresets } from '@codeleap/web'
import { variantProvider } from '../theme'
import { assignTextStyle } from './Text'

const createSelectStyle = variantProvider.createVariantFactory<SelectComposition>()

const defaultStyles = SelectPresets

const placeholderSize = 120

export const AppSelectStyles = {
  ...defaultStyles,
  default: createSelectStyle((theme) => ({
    wrapper: {
      ...theme.presets.column,
    },
    innerWrapper: {
      minHeight: theme.values.itemHeight.default,
      maxHeight: theme.values.itemHeight.default,
      borderRadius: theme.borderRadius.small,
      ...theme.spacing.paddingHorizontal(2),
      ...theme.border.neutral5({ width: 1 }),
      paddingVertical: theme.spacing.value(0),
      ...theme.presets.row,
      ...theme.presets.alignCenter,
      ...theme.presets.justifySpaceBetween,
      backgroundColor: theme.colors.neutral1,
      position: 'relative',
      cursor: 'pointer',

      '*': {
        fontFamily: theme.typography.base.fontFamily,
      }
    },
    'innerWrapper:searchable': {
      cursor: 'text',
    },
    "innerWrapper:focus": {
      ...theme.border.primary3({ width: 1 }),
    },
    "innerWrapper:error": {
      ...theme.border.destructive2({ width: 1 }),
    },
    "innerWrapper:disabled": {
      ...theme.border.neutral2({ width: 1 }),
      cursor: 'not-allowed'
    },
    input: {
      ...assignTextStyle('p1')(theme).text,
      flex: 1,
      width: '100%',
      color: theme.colors.neutral10,
      borderWidth: 0,
      margin: theme.spacing.value(0),
      padding: theme.spacing.value(0),
      height: '100%',
    },
    'input:focus': {
      caretColor: theme.colors.primary3,
      border: 'none',
    },
    'input:disabled': {
      color: theme.colors.neutral5,
      backgroundColor: 'transparent',
      cursor: 'not-allowed'
    },
    'input:error': {
      color: theme.colors.destructive2,
    },
    'inputContainer': {
      flex: 1,
      width: '100%',
      border: 'none',
      height: '100%',
      ...theme.presets.row,
      ...theme.presets.alignCenter,
      ...theme.presets.justifySpaceBetween,
      padding: theme.spacing.value(0),
    },
    'inputContainer:focus': {
      border: 'none',
    },
    placeholder: {
      color: theme.colors.neutral7,
      position: 'absolute',
    },
    "placeholder:disabled": {
      color: theme.colors.neutral5,
    },
    'valueWrapper': {
      padding: theme.spacing.value(0),
      margin: theme.spacing.value(0),
      height: '100%',
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    'valueMultiple': {
      width: 'auto',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    iconIcon: {
      height: theme.values.iconSize[2],
      width: theme.values.iconSize[2],
      color: theme.colors.neutral7,
    },
    "iconIcon:focus": {
      color: theme.colors.primary3,
    },
    "iconIcon:disabled": {
      color: theme.colors.neutral5,
      cursor: 'not-allowed'
    },
    "iconIcon:error": {
      color: theme.colors.destructive2,
    },
    iconTouchableWrapper: {
      ...theme.spacing.padding(0),
      height: theme.values.iconSize[2],
      width: theme.values.iconSize[2],
      backgroundColor: theme.colors['neutral1'],
    },
    'iconTouchableWrapper:disabled': {
      backgroundColor: theme.colors['neutral1'],
    },
    leftIconTouchableWrapper: {
      ...theme.spacing.marginRight(2),
    },
    rightIconTouchableWrapper: {
      ...theme.spacing.marginLeft(2),
    },
    errorMessage: {
      ...theme.spacing.paddingLeft(2),
    },
    'dropdownIcon': {
      cursor: 'pointer'
    },
    'clearIcon': {
      cursor: 'pointer'
    },
    'itemsWrapper': {
      ...theme.presets.column,
      ...theme.spacing.gap(1),
    },
    itemWrapper: {
      width: '100%',
      height: '100%',
      minHeight: theme.values.itemHeight.default,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      borderRadius: theme.borderRadius.small,
      ...theme.spacing.padding(2),
      backgroundColor: theme.colors.neutral1,

      transition: 'all 0.2s',
      
      '&:hover': {
        backgroundColor: theme.colors.neutral2,
      },
    },
    'itemWrapper:focused': {
      backgroundColor: theme.colors.neutral2,

      '&:hover': {
        backgroundColor: theme.colors.neutral2,
      },
    },
    'itemWrapper:selected': {
      backgroundColor: theme.colors.primary3,

      '&:hover': {
        backgroundColor: theme.colors.primary3,
      },
    },
    'itemWrapper:selectedFocused': {
      backgroundColor: theme.colors.primary3,

      '&:hover': {
        backgroundColor: theme.colors.primary3,
      },
    },
    'itemText': {
      ...assignTextStyle('p1')(theme).text,
      color: theme.colors.neutral10,
      textAlign: 'left'
    },
    'itemText:selected': {
      ...assignTextStyle('h5')(theme).text,
    },
    'itemRightIcon': {
      height: theme.values.iconSize[2],
      width: theme.values.iconSize[2],
      color: theme.colors.neutral10,
    },
    listPortal: {
      zIndex: 1,
      position: 'absolute',
      top: theme.values.itemHeight.default,
      left: 0,
      right: 0,
      width: '100%',
      overflow: 'visible'
    },
    listWrapper: {
      borderRadius: theme.borderRadius.small,
      width: '100%',
      cursor: 'default',
    },
    list: {
      ...theme.spacing.paddingVertical(0),
      ...theme.spacing.padding(2),
      maxHeight: theme.values.itemHeight.default * 4,
      overflowY: 'auto',
    },
    listPlaceholder: {
      minHeight: theme.values.itemHeight.default,
      ...theme.presets.column,
      ...theme.presets.center,
      ...theme.spacing.gap(2),
    },
    listPlaceholderIcon: {
      width: placeholderSize,
      ...theme.presets.center,
    },
    listPlaceholderText: {
      ...assignTextStyle('h5')(theme).text,
      color: theme.colors.neutral6,
      textAlign: 'center',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      ...theme.presets.fullWidth,
      ...theme.presets.center,
    },
    listPlaceholderNoItems: {
      minHeight: theme.values.itemHeight.default,
      ...theme.presets.column,
      ...theme.presets.center,
      ...theme.spacing.gap(2),
    },
    listPlaceholderNoItemsIcon: {
      width: placeholderSize,
    },
    listPlaceholderNoItemsText: {
      ...assignTextStyle('h5')(theme).text,
      color: theme.colors.neutral6,
      textAlign: 'center',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      ...theme.presets.fullWidth,
      ...theme.presets.center,
    },
    loadingIndicator: {
      minHeight: theme.values.itemHeight.default,
      ...theme.presets.center,
    },
  })),
}
