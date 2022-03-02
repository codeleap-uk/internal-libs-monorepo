import * as Components from '@codeleap/web'
import { variantProvider } from './theme'

import { Image } from '@/components/Image'
import { Link } from '@/components/Link'

import { AppViewStyles } from './stylesheets/View'
import { AppTextStyles } from './stylesheets/Text'
import { AppTextInputStyles } from './stylesheets/TextInput'
import { AppButtonStyle } from './stylesheets/Button'
import { AppIconStyles } from './stylesheets/Icon'
import { AppModalStyles } from './stylesheets/Modal'
import { AppActivityIndicatorStyles } from './stylesheets/ActivityIndicator'
import { AppSelectStyles } from './stylesheets/Select'
import { MyComponent } from '../components/MyComponent'
import { MyComponentStyle } from './stylesheets/MyComponent'
import { AppTooltipStyles } from './stylesheets/Tooltip'
import { AppRouterPageStyles } from './stylesheets/RouterPage'
import { AppDrawerStyles } from './stylesheets/Drawer'
import { AppOverlayStyles } from './stylesheets/Overlay'
import { AppCenterWrapperStyles } from './stylesheets/CenterWrapper'
import { AppRadioInputStyles } from './stylesheets/RadioInput'
import { AppCheckboxStyle } from './stylesheets/Checkbox'

const defaultStyles = variantProvider.getDefaultVariants()

export const variants = {
  ...defaultStyles,
  View: AppViewStyles,
  Text: AppTextStyles,
  TextInput: AppTextInputStyles,
  RadioInput: AppRadioInputStyles,
  Modal: AppModalStyles,
  Button: AppButtonStyle,
  Icon: AppIconStyles,
  ActivityIndicator: AppActivityIndicatorStyles,
  MobileSelect: AppSelectStyles,
  MyComponent: MyComponentStyle,
  RouterPage: AppRouterPageStyles,
  CenterWrapper: AppCenterWrapperStyles,
  Checkbox: AppCheckboxStyle,
  Select: AppSelectStyles,
}

const components = variantProvider.typeComponents({
  View: [Components.View, AppViewStyles],
  Icon: [Components.Icon, AppIconStyles],
  Text: [Components.Text, AppTextStyles],
  Touchable: [Components.Touchable, defaultStyles.Touchable],
  TextInput: [Components.TextInput, AppTextInputStyles],
  // Switch: [Components.Switch, defaultStyles.Switch],
  Checkbox: [Components.Checkbox, defaultStyles.Checkbox],
  RadioInput: [Components.RadioGroup, defaultStyles.RadioInput],
  ContentView: [Components.ContentView, defaultStyles.ContentView],
  Select: [Components.Select, AppSelectStyles],
  Slider: [Components.Slider, defaultStyles.Slider],
  FileInput: [Components.FileInput, defaultStyles.FileInput],
  Image: [Image, defaultStyles.Image],
  Scroll: [Components.Scroll, defaultStyles.View],
  List: [Components.List, defaultStyles.View],
  ActivityIndicator: [
    Components.ActivityIndicator,
    defaultStyles.ActivityIndicator,
  ],
  CenterWrapper: [Components.CenterWrapper, AppCenterWrapperStyles],
  Button: [Components.Button, AppButtonStyle],
  Modal: [Components.Modal, AppModalStyles],
  Link: [Link, AppTextStyles],
  // Pager: [Components.Pager, AppPagerStyle],
  Menu: [Components.Menu, {}],
  Tooltip: [Components.Tooltip, AppTooltipStyles],
  RouterPage: [Components.RouterPage, AppRouterPageStyles],
  MyComponent: [MyComponent, MyComponentStyle],
  Drawer: [Components.Drawer, AppDrawerStyles],
  Overlay: [Components.Overlay, AppOverlayStyles],
})

export default components
