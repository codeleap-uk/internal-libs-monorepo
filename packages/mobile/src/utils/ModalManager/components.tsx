import * as React from 'react'
import { usePrevious, onMount, onUpdate, PropsOf } from '@codeleap/common'
import { useModalContext } from './context'
import { Portal } from '@gorhom/portal'
import { Modal } from '../../components/Modal'

type AbsoluteModalProps = Omit<PropsOf<typeof Modal>, 'visible' | 'toggle'> & {
  id?: string
  initialVisible ?: boolean
  parent?: string
  visible?: boolean
  toggle?: PropsOf<typeof Modal>['toggle']
}

export const AbsoluteModal:React.FC<AbsoluteModalProps> = ({
  children,
  id,
  initialVisible = false,
  parent,
  ...props
}) => {

  const modalId = id
  const modals = useModalContext()

  onMount(() => {
    if (!modalId) return
    modals.setModal(modalId, {
      attachedTo: [],
      attachments: [],
      visible: initialVisible,
    })
  })

  const prevParent = usePrevious(parent)

  onUpdate(() => {
    if (!modalId) return
    if (!!parent || !!prevParent) {
      modals.attach(modalId, parent)
    }
  }, [parent])

  const visible = modalId ? modals.isVisible(modalId) : props.visible

  return <Portal>
    <Modal {...props} visible={visible} toggle={() => {
      if (modalId) {
        modals.toggleModal(modalId)
      } else {
        props.toggle()
      }
    }}>
      {children}
    </Modal>
  </Portal>
}

