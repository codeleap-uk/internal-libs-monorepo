import { AppIcon, StyleRecord, StyledProp } from '@codeleap/styles'
import { ImageProps } from '../Image'
import { EmptyPlaceholderComposition } from './styles'
import { ReactElement, ReactNode } from 'react'
import { AnyFunction } from '@codeleap/types'
import { ButtonProps } from '../Button'

export type EmptyPlaceholderProps = {
  itemName?: string
  title?: string
  description?: string
  image?: ImageProps['source']
  icon?: AppIcon
  loading?: boolean
  style?: StyledProp<EmptyPlaceholderComposition>
  LoadingComponent?: ReactElement
  children?: ReactNode
  onPress?: AnyFunction
  buttonText?: string
}

export type EmptyPlaceholderInfoProps = Pick<EmptyPlaceholderProps, 'title' | 'description'>

export type EmptyPlaceholderIllustrationProps = Pick<EmptyPlaceholderProps, 'image' | 'icon'>

export type EmptyPlaceholderButtonProps = Pick<EmptyPlaceholderProps, 'onPress'> & Omit<ButtonProps, 'style' | 'debugName'>

export type EmptyPlaceholderCtxValue = Omit<EmptyPlaceholderProps, 'style' | 'children'> & {
  styles: StyleRecord<EmptyPlaceholderComposition>
}