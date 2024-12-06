import { TypeGuards } from '@codeleap/types'
import { create } from 'zustand'

type TModalStore = { 
  identifier: string | null
  indexes: Record<string, number>
  modals: Record<string, boolean>
  setIndex: (visible: boolean, modalIdentifier: string) => void
  toggle: (id: string, to?: boolean) => void
}

const INDEX = 99

export const ModalStore = create<TModalStore>((set) => ({ 
  identifier: null,
  indexes: {},
  modals: {},
  setIndex: (visible: boolean, modalIdentifier: string) => set(store => {
    const indexes = store.indexes

    if (!visible) {
      indexes[modalIdentifier] = INDEX

      return { indexes }
    }

    let currentIndex = 0

    for (const key in indexes) {
      if (indexes[key] > currentIndex) {
        currentIndex = indexes[key]
      }
    }

    indexes[modalIdentifier] = currentIndex + INDEX

    return { indexes }
  }),
  toggle: (id: string, to = null) => set(store => {
    const modals = store.modals

    const hasModal = TypeGuards.isBoolean(modals?.[id])
    const visible = TypeGuards.isBoolean(to) ? to : (hasModal ? !modals?.[id] : true)

    modals[id] = visible

    return { modals }
  })
}))

export function toggleModal(id: string, to: boolean = null) {
  ModalStore.getState().toggle(id, to)
}

export function modalScrollLock(to: boolean, modalIdentifier: string) {
  let modalId = ModalStore.getState().identifier

  const alreadyDifferentOpenedModal = !TypeGuards.isNil(modalId) && modalIdentifier !== modalId
  
  if (alreadyDifferentOpenedModal) return

  if (TypeGuards.isNil(modalId) && to === true) {
    ModalStore.setState({ identifier: modalIdentifier })
    modalId = modalIdentifier
  } else if (!TypeGuards.isNil(modalId) && to === false) {
    ModalStore.setState({ identifier: null })
  }

  const htmlStyle = document?.documentElement?.style

  if (htmlStyle.overflowX !== 'hidden') {
    htmlStyle.overflowX = 'hidden'
  }

  if (to) {
    htmlStyle.overflowY = 'hidden'
  } else if (modalIdentifier === modalId && to === false) {
    htmlStyle.overflowY = 'auto'
  }
}
