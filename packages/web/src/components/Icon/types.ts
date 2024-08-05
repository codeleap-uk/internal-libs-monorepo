import { ComponentCommonProps } from '../../types'
import { IconComposition } from './styles'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { CSSProperties } from 'react'

export type IconProps = 
  ComponentCommonProps & 
  {
    name: AppIcon
    style?: StyledProp<IconComposition>
    size?: string | number
    color?: string
    renderEmptySpace?: boolean
    forceStyle?: CSSProperties
  }
