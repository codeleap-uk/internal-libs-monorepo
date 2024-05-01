import { useModalContext, useModalSequence, Provider } from './context'
import { Modal, ManagedModalProps } from './components'

export const ModalManager = {
  useModalContext,
  Modal,
  Provider,
  useModalSequence,
}

export type {
  ManagedModalProps,
}
