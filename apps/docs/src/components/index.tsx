import React from 'react'
import { StyleSheets } from '@/app'
import * as LibComponents from '@codeleap/web'

LibComponents.SearchInput.defaultProps.searchIcon = 'search'
LibComponents.SearchInput.defaultProps.clearIcon = 'x'

export const Text = LibComponents.Text.withVariantTypes(StyleSheets.TextStyles)
export const View = LibComponents.View.withVariantTypes(StyleSheets.ViewStyles)
export const Touchable = LibComponents.Touchable.withVariantTypes(StyleSheets.TouchableStyles)
export const Button = LibComponents.Button.withVariantTypes(StyleSheets.ButtonStyles)
export const ActionIcon = LibComponents.ActionIcon.withVariantTypes(StyleSheets.ActionIconStyles)
export const Drawer = LibComponents.Drawer.withVariantTypes(StyleSheets.DrawerStyles)
export const Icon = LibComponents.Icon.withVariantTypes(StyleSheets.IconStyles)
export const Checkbox = LibComponents.Checkbox.withVariantTypes(StyleSheets.CheckboxStyles)
export const TextInput = LibComponents.TextInput.withVariantTypes(StyleSheets.TextInputStyles)

export * from './Header'
export * from './Page'
export * from './Image'
export * from './Link'
export * from './Page'
export * from './Logo'
export * from './GlobalStyle'
export * from './CenterWrapper'
