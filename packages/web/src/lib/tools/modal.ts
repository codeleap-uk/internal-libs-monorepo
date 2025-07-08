import { TypeGuards } from '@codeleap/types'
import { globalState } from '@codeleap/store'

const overlapIndex = 99

export const modalsState = globalState<{ currentModal: string | null; indexes: Record<string, number> }>({ currentModal: null, indexes: {} })

export function modalInferIndexes(visible: boolean, id: string) {
  const indexes = { ...modalsState.value?.indexes }

  if (!visible) {
    indexes[id] = overlapIndex
  } else {
    let currentIndex = 0

    for (const key in indexes) {
      if (indexes[key] > currentIndex) {
        currentIndex = indexes[key]
      }
    }

    indexes[id] = currentIndex + overlapIndex
  }

  modalsState.set({ indexes })
}

export function modalScrollLock(to: boolean, modalIdentifier: string) {
  let modalId = modalsState.value?.currentModal

  const alreadyDifferentOpenedModal = !TypeGuards.isNil(modalId) && modalIdentifier !== modalId

  if (alreadyDifferentOpenedModal) return

  if (TypeGuards.isNil(modalId) && to === true) {
    modalsState.set({ currentModal: modalIdentifier })
    modalId = modalIdentifier
  } else if (!TypeGuards.isNil(modalId) && to === false) {
    modalsState.set({ currentModal: null })
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
