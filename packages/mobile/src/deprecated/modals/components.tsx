import React from 'react'
import { usePrevious, onMount, onUpdate } from '@codeleap/hooks'
import { PropsOf } from '@codeleap/types'
import { useModalContext } from './Context'
import { Portal } from '@gorhom/portal'
import { Modal as _Modal } from '../../components/Modal'

type UseManagedModalArgs = {
  id?: string
  initialVisible?: boolean
  parent?: string
  visible?: boolean
  toggle?: PropsOf<typeof _Modal>['toggle']
}

function useManagedModal(props: UseManagedModalArgs) {
  const {
    initialVisible = false,
    parent,
    id,
  } = props
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

  const componentProps = {
    ...props, ...ctxProps, visible: visible, toggle: () => {
      if (modalId) {
        modals.toggleModal(modalId)
      } else {
        props?.toggle?.()
      }
    },
  }

  return componentProps
}
export type ManagedModalProps<T = PropsOf<typeof _Modal>> = Omit<T, 'visible' | 'toggle'> & UseManagedModalArgs & {

  absolute?: boolean

}
export const Modal: React.FC<ManagedModalProps> = ({
  children,
  absolute = true,
  ...props
}) => {
  const componentProps = useManagedModal(props)

  const content = (
    <_Modal {...componentProps}>
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