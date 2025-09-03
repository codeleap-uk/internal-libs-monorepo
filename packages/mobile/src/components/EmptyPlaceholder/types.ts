import { AppIcon, StyledProp } from '@codeleap/styles'
import { ReactElement } from 'react'
import { ImageProps } from '../Image'
import { EmptyPlaceholderComposition } from './styles'

type RenderEmpty = (props: {
  emptyText: string | ReactElement
  emptyIconName?: AppIcon
  style?: StyledProp<EmptyPlaceholderComposition>
}) => ReactElement

export type EmptyPlaceholderProps = {
  itemName?: string
  title?: ReactElement | string
  description?: ReactElement | string
  image?: ImageProps['source']
  icon?: AppIcon
  loading?: boolean
  button?: () => void
  buttonText?: string
  style?: StyledProp<EmptyPlaceholderComposition>
  renderEmpty?: RenderEmpty
}
