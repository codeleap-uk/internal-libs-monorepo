import { ComponentVariants, PropsOf, StylesOf } from '@codeleap/common'
import { ProgressBarComposition, ProgressBarPresets } from './styles'
import { ProgressProps, ProgressIndicatorProps } from '@radix-ui/react-progress'
import { IconProps, View } from '../../components'

export type ProgressBarProps = ComponentVariants<typeof ProgressBarPresets> &
  Omit<PropsOf<typeof View>, 'variants' | 'responsiveVariants' | 'styles'> & {
    progress: number
    style?: React.CSSProperties
    styles?: StylesOf<ProgressBarComposition>
    textProps?: PropsOf<typeof Text>
    progressIndicatorProps?: ProgressIndicatorProps
    progressRootProps?: ProgressProps
    showProgress?: boolean
    leftIcon?: IconProps['name']
    rightIcon?: IconProps['name']
    leftText?: string | number
    rightText?: string | number
    debugName?: string
  }
