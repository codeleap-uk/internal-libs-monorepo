import React from 'react'
import { ViewStyle } from 'react-native'

export type DetectorProps = {
  children: React.ReactNode
  style?: any
  withWrapper?: boolean
}

export type InterceptorProps = {
  children: React.ReactNode
}

export type LayoutProps = {
  style?: ViewStyle
  hideOverlay?: boolean
  mode: 'overlay' | 'content'
  isOpen: boolean
  position: 'left' | 'right' | 'center'
  gap: number
  animationDuration?: number
  children: React.ReactNode
  content: React.ReactNode
  id: string
}