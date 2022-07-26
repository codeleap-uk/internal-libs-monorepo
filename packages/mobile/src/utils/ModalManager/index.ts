import { useModalContext, useModalSequence, Provider } from './context'
import { Modal, ManagedModalProps, Drawer, ManagedDrawerProps } from './components'

export const ModalManager = {
  useModalContext,
  Modal,
  Drawer,
  Provider,
  useModalSequence,
}

export type {
  ManagedModalProps,
  ManagedDrawerProps,

}
