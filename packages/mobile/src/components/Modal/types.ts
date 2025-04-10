import { PropsOf } from '@codeleap/types'
import { AppIcon, ICSS, StyledProp } from '@codeleap/styles'
import { ButtonProps } from '../Button'
import { Scroll } from '../Scroll'
import { ViewProps } from '../View'
import { ModalComposition } from './styles'
import { ReanimatedEnteringAnimation, ReanimatedExitingAnimation } from '../../types'

export type ModalProps =
  Omit<ViewProps, 'style'> &
  {
    dismissOnBackdrop?: boolean
    buttonProps?: ButtonProps
    accessible?: boolean
    showClose?: boolean
    closable?: boolean
    footer?: React.ReactNode
    title?: React.ReactNode
    debugName?: string
    closeIconName?: AppIcon
    visible?: boolean
    toggle?: () => void
    description?: React.ReactElement
    scroll?: boolean
    header?: React.ReactElement
    closeOnHardwareBackPress?: boolean
    renderHeader?: (props: ModalHeaderProps) => React.ReactElement
    keyboardAware?: boolean
    scrollProps?: PropsOf<typeof Scroll, 'ref'>
    style?: StyledProp<ModalComposition>
    id?: string
    withPortal?: boolean
    boxEntering?: ReanimatedEnteringAnimation
    boxExiting?: ReanimatedExitingAnimation
  }

export type ModalHeaderProps =
  Omit<ModalProps, 'renderHeader'> &
  {
    styles: Record<ModalComposition, ICSS>
    buttonStyles: any
    description?: React.ReactElement
  }
