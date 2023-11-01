import { TypeGuards } from '@codeleap/common'
import { create } from 'zustand'

type TModalStore = { 
  identifier: string | null
  indexes: Record<string, number>
  setIndex: (visible: boolean, modalIdentifier: string) => void
}

const INDEX = 99

export const ModalStore = create<TModalStore>((set) => ({ 
  identifier: null,
  indexes: {},
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
}))

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
