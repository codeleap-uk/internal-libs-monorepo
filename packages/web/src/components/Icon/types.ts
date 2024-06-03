/** @jsx jsx */
import { CSSObject } from '@emotion/react'
import { CSSInterpolation } from '@emotion/css'
import {
  IconPlaceholder,
} from '@codeleap/common'
import { ComponentCommonProps } from '../../types'
import { IconComposition } from './styles'
import { StyledProp } from '@codeleap/styles'

export type IconProps = ComponentCommonProps & {
    name: IconPlaceholder
    style?: StyledProp<IconComposition>
    size?: string | number
    color?: string
    renderEmptySpace?: boolean
    forceStyle?: CSSObject | CSSInterpolation | React.CSSProperties
  }
