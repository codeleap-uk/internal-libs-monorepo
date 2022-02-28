export * from './Settings'
export * from './components'
export * from './logger'
export * from './theme'
export { LocalStorageKeys } from './constants'
export * from './api'
export type { AppIcon } from './assets/icons'
import * as AppComponents from '../components'
import LibComponents from './components'
import React from 'react'

export const allComponents = {
  ...LibComponents,
  ...AppComponents,
}

export const {
  View,
  Checkbox,
  Button,
  Text,
  Icon,
  FileInput,
  TextInput,
  Select,
  MyComponent,
  Touchable,
  Slider,
  CenterWrapper,
  Image,
  Scroll,
  List,
  Link,
  Drawer,
  Overlay,
  ActivityIndicator,
  RadioInput,
  ContentView,
  RouterPage,
  Menu,
  Tooltip,
  Modal,
  AppStatusOverlay,
  Avatar,

} = allComponents

export {
  React,
}
