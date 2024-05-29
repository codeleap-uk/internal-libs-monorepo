import { StyledProp } from '@codeleap/styles'
import { AvatarProps } from '../Avatar/types'
import { AvatarGroupComposition } from './styles'

export type AvatarGroupProps = {
  style?: StyledProp<AvatarGroupComposition>
  avatars: Partial<AvatarProps>[]
  displacement?: number
  debugName: string
}
