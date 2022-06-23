import * as React from 'react'
import { usePrevious, onMount, onUpdate, PropsOf } from '@codeleap/common'
import { useModalContext } from './context'
import { Portal } from '@gorhom/portal'
import { Modal as _Modal } from '../../components/Modal'

export type ManagedModalProps<T = PropsOf<typeof _Modal>> = Omit<T, 'visible' | 'toggle'> & {
  id?: string
  initialVisible ?: boolean
  parent?: string
  absolute?: boolean
  visible?: boolean
  toggle?: PropsOf<typeof _Modal>['toggle']
}

export const Modal:React.FC<ManagedModalProps> = ({
  children,
  id,
  absolute = true,
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

  const ctxProps = modals?.state?.[modalId]?.props
  const content = (
    <_Modal {...props} {...ctxProps} visible={visible} toggle={() => {
      if (modalId) {
        modals.toggleModal(modalId)
      } else {
        props?.toggle?.()
      }
    }}>
      {children}
    </_Modal>
  )

  if (absolute) {
    return <Portal>
      {content}
    </Portal>
  }

  return content
}

