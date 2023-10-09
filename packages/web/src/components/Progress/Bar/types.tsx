import { ComponentVariants, PropsOf, StylesOf } from '@codeleap/common'
import { ProgressBarComposition, ProgressBarPresets } from './styles'
import { ProgressProps, ProgressIndicatorProps } from '@radix-ui/react-progress'
import { View } from '../../components'

export type ProgressBarProps = ComponentVariants<typeof ProgressBarPresets> &
  Omit<PropsOf<typeof View>, 'variants' | 'responsiveVariants' | 'styles'> & {
    progress: number
    style?: React.CSSProperties
    text?: string | number
    styles?: StylesOf<ProgressBarComposition>
    textProps?: PropsOf<typeof Text>
    progressIndicatorProps?: ProgressIndicatorProps
    progressRootProps?: ProgressProps
    hideText?: boolean
  }
