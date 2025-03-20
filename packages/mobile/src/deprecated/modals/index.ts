import { useModalContext, useModalSequence, Provider } from './Context'
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