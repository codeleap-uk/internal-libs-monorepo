import {
  AnyFunction,
  IconPlaceholder,
  PropsOf,
} from '@codeleap/common'
import React from 'react'
import { OverlayProps } from '../Overlay'
import { ModalComposition } from './styles'
import { ActionIconProps } from '../ActionIcon'
import { TouchableProps } from '../Touchable'
import { StyledProp } from '@codeleap/styles'

export type ModalProps =
  {
    visible?: boolean
    children?: React.ReactNode
    title?: React.ReactNode | string
    description?: React.ReactNode | string
    renderModalBody?: (props: ModalBodyProps) => React.ReactElement
    toggle?: AnyFunction
    style?: StyledProp<ModalComposition>
    accessible?: boolean
    showClose?: boolean
    closable?: boolean
    dismissOnBackdrop?: boolean
    scroll?: boolean
    header?: React.ReactElement
    footer?: React.ReactNode
    withOverlay?: boolean
    closeIconName?: IconPlaceholder
    keepMounted?: boolean
    renderHeader?: (props: ModalHeaderProps) => React.ReactElement
    debugName?: string
    closeButtonProps?: Partial<ActionIconProps>
    closeOnEscape?: boolean
    onClose?: () => void
    overlayProps?: Partial<OverlayProps>
    zIndex?: number
    withScrollContainer?: boolean
    scrollLock?: boolean
    backdropProps?: Partial<TouchableProps>
    alterHistory?: boolean
    modalId?: string
    autoIndex?: boolean
  }

export type ModalBodyProps = {
    id: string
    styles: PropsOf<ModalComposition>
  }

export type ModalHeaderProps = Partial<Omit<ModalProps, 'children'>> & {
    id: string
    styles: PropsOf<ModalComposition>
    onPressClose: () => void
  }
