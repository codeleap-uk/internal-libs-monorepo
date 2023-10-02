import { ViewPresets } from './View/styles'
import { IconPresets } from './Icon/styles'
import { TouchablePresets } from './Touchable/styles'
import { TextPresets } from './Text/styles'
import { ScrollPresets } from './Scroll/styles'
import { ActivityIndicatorPresets } from './ActivityIndicator/styles'
import { ButtonPresets } from './Button/styles'
import { ActionIconPresets } from './ActionIcon/styles'
import { ModalPresets } from './Modal/styles'
import { CheckboxPresets } from './Checkbox/styles'
import { CollapsePresets } from './Collapse/styles'
import { DrawerPresets } from './Drawer/styles'
import { OverlayPresets } from './Overlay/styles'
import { TextInputPresets } from './TextInput/styles'
import { RadioInputPresets } from './RadioInput/styles'
import { SelectPresets } from './Select/styles'
import { ListPresets, PaginationIndicatorStyles } from './List'
import { SliderPresets } from './Slider/styles'
import { LoadingOverlayPresets } from './LoadingOverlay/styles'
import { InputBasePresets } from './InputBase'
import { SwitchPresets } from './Switch/styles'
import { NumberIncrementPresets } from './NumberIncrement/styles'
import { TooltipPresets } from './Tooltip/styles'
import { SegmentedControlPresets } from './SegmentedControl/styles'
import { PagerPresets } from './Pager/styles'
import { EmptyPlaceholderPresets } from './EmptyPlaceholder/styles'
import { GridPresets } from './Grid/styles'
import { BadgePresets } from './Badge/styles'
import { CropPickerPresets } from './CropPicker'

export const defaultStyles = {
  View: ViewPresets,
  Icon: IconPresets,
  Touchable: TouchablePresets,
  Text: TextPresets,
  ActivityIndicator: ActivityIndicatorPresets,
  ActionIcon: ActionIconPresets,
  Scroll: ScrollPresets,

  Button: ButtonPresets,
  Modal: ModalPresets,
  Checkbox: CheckboxPresets,
  Collapse: CollapsePresets,
  Drawer: DrawerPresets,
  Overlay: OverlayPresets,
  TextInput: TextInputPresets,
  RadioInput: RadioInputPresets,
  Select: SelectPresets,
  List: ListPresets,
  Slider: SliderPresets,
  LoadingOverlay: LoadingOverlayPresets,
  InputBase: InputBasePresets,
  Switch: SwitchPresets,
  NumberIncrement: NumberIncrementPresets,
  Tooltip: TooltipPresets,
  SegmentedControlPresets: SegmentedControlPresets,
  Pager: PagerPresets,
  EmptyPlaceholder: EmptyPlaceholderPresets,
  PaginationIndicator: PaginationIndicatorStyles,
  Grid: GridPresets,
  Badge: BadgePresets,
  CropPicker: CropPickerPresets,
}

import createCache from '@emotion/cache'

export const createCodeleapWebCache = () => {
  return createCache({
    key: 'codeleap-web',
  })
}

export const codeleapWebCache = createCodeleapWebCache()
