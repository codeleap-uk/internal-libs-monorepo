import { React, variantProvider } from '@/app'
import { IconPlaceholder } from '@codeleap/common'
import * as LibComponents from '@codeleap/web'
import { defaultStyles } from '@codeleap/web'
import * as StyleSheets from '../app/stylesheets'

export const variants = {
  ...defaultStyles,
  Alert: StyleSheets.AppAlertStyles,
  Checkbox: StyleSheets.AppCheckboxStyles,
  RadioInput: StyleSheets.AppRadioInputStyles,
  Touchable: StyleSheets.AppTouchableStyles,
  Button: StyleSheets.AppButtonStyles,
  Icon: StyleSheets.AppIconStyles,
  ActivityIndicator: StyleSheets.AppActivityIndicatorStyles,
  Select: StyleSheets.AppSelectStyles,
  Text: StyleSheets.AppTextStyles,
  View: StyleSheets.AppViewStyles,
  Modal: StyleSheets.AppModalStyles,
  Drawer: StyleSheets.AppDrawerStyles,
  TextInput: StyleSheets.AppTextInputStyles,
  Image: StyleSheets.AppImageStyles,
  Link: StyleSheets.LinkStyles,
  Logo: StyleSheets.LogoStyles,
  Page: StyleSheets.PageStyles,
  Overlay: StyleSheets.AppOverlayStyles,
  List: StyleSheets.AppListStyles,
  Avatar: StyleSheets.AvatarStyles,
  CenterWrapper: StyleSheets.CenterWrapperStyles,
  ActionIcon: StyleSheets.AppActionIconStyles,
  LoadingOverlay: StyleSheets.AppLoadingOverlayStyles,
  InputBase: StyleSheets.AppInputBaseStyles,
  Switch: StyleSheets.AppSwitchStyles,
  Slider: StyleSheets.AppSliderStyles,
  NumberIncrement: StyleSheets.AppNumberIncrementStyles,
  Tooltip: StyleSheets.AppTooltipStyles,
  Badge: StyleSheets.AppBadgeStyles,
  SegmentedControl: StyleSheets.AppSegmentedControlStyles,
  Pager: StyleSheets.AppPagerStyles,
  CardBase: StyleSheets.AppCardBaseStyles,
  Navigation: StyleSheets.NavigationStyles,
  EmptyPlaceholder: StyleSheets.AppEmptyPlaceholderStyles,
  Grid: StyleSheets.AppGridStyles
}

LibComponents.SearchInput.defaultProps.searchIcon = 'search' as IconPlaceholder
LibComponents.SearchInput.defaultProps.clearIcon = 'close' as IconPlaceholder

const components = variantProvider.typeComponents({
  View: [LibComponents.View, variants.View],
  Icon: [LibComponents.Icon, variants.Icon],
  Text: [LibComponents.Text, variants.Text],
  Touchable: [LibComponents.Touchable, variants.Touchable],
  Scroll: [LibComponents.Scroll, variants.Scroll],
  ActivityIndicator: [
    LibComponents.ActivityIndicator,
    variants.ActivityIndicator,
  ],
  Button: [LibComponents.Button, variants.Button],
  ActionIcon: [LibComponents.ActionIcon, variants.ActionIcon],
  Modal: [LibComponents.Modal, variants.Modal],
  Checkbox: [LibComponents.Checkbox, variants.Checkbox],
  RadioInput: [LibComponents.RadioGroup, variants.RadioInput],
  SegmentedControl: [LibComponents.SegmentedControl, variants.SegmentedControl],
  Select: [LibComponents.Select, variants.Select],
  TextInput: [LibComponents.TextInput, variants.TextInput],
  Overlay: [LibComponents.Overlay, variants.Overlay],
  FileInput: [LibComponents.FileInput, {}],
  List: [LibComponents.List, variants.List],
  Drawer: [LibComponents.Drawer, variants.Drawer],
  LoadingOverlay: [LibComponents.LoadingOverlay, variants.LoadingOverlay],
  InputBase: [LibComponents.InputBase, variants.InputBase],
  Switch: [LibComponents.Switch, variants.Switch],
  Slider: [LibComponents.Slider, variants.Slider],
  NumberIncrement: [LibComponents.NumberIncrement, variants.NumberIncrement],
  Tooltip: [LibComponents.Tooltip, variants.Tooltip],
  Badge: [LibComponents.Badge, variants.Badge],
  Pager: [LibComponents.Pager, variants.Pager],
  EmptyPlaceholder: [LibComponents.EmptyPlaceholder, variants.EmptyPlaceholder],
  Grid: [LibComponents.Grid, variants.Grid],
})

const SelectWithGenerics = LibComponents.Select as <
  T extends string | number = string,
  Multi extends boolean = false
>(
  props: LibComponents.SelectProps<T, Multi>
) => JSX.Element

export const allComponents = {
  ...components,
  Select: SelectWithGenerics,
}

export const {
  View,
  Button,
  Text,
  Icon,
  Touchable,
  ActionIcon,
  Scroll,
  ActivityIndicator,
  Modal,
  Checkbox,
  RadioInput,
  Select,
  TextInput,
  Overlay,
  LoadingOverlay,
  FileInput,
  List,
  Drawer,
  Switch,
  NumberIncrement,
  Tooltip,
  SegmentedControl,
  Pager,
  Grid,
} = allComponents

export * from './Header'
export * from './Page'
export * from './Image'
export * from './Link'
export * from './Page'
export * from './Logo'
export * from './GlobalStyle'
export * from './CenterWrapper'

export default components
