/** @jsx jsx */
import { CSSObject } from '@emotion/react'
import { CSSInterpolation } from '@emotion/css'
import {
  IconPlaceholder,
} from '@codeleap/common'
import { ComponentCommonProps } from '../../types'

export type IconProps = ComponentCommonProps & {
    name: IconPlaceholder
    style?: React.CSSProperties
    size?: string | number
    color?: string
    renderEmptySpace?: boolean
    forceStyle?: CSSObject | CSSInterpolation | React.CSSProperties
  }
