import { useCallback, useRef } from 'react'
import { useId } from '@codeleap/hooks'
import { atom } from 'nanostores'
import { useStore } from '@nanostores/react'

const defaultValue = '@input.atom'

const inputIdAtom = atom<string>(defaultValue)

const closeInputOverlays = () => {
  const currentInputId = inputIdAtom.get()

  if (currentInputId === defaultValue) return

  setTimeout(() => inputIdAtom.set(defaultValue), 100)
}

const toggleOverlay = (id: string) => {
  const currentInputId = inputIdAtom.get()

  const isOpen = currentInputId === id

  inputIdAtom.set(isOpen ? defaultValue : id)
}

const useInputOverlay = (providedId?: string) => {
  const id = useId(providedId)

  const isCurrentlyOpen = useStore(inputIdAtom) === id

  const toggle = useCallback(() => {
    const currentInputId = inputIdAtom.get()

    const isAnyOtherOpen = currentInputId !== defaultValue && currentInputId !== id
    const isOpen = currentInputId === id

    if (isAnyOtherOpen && !isOpen) {
      inputIdAtom.set(defaultValue)

      setTimeout(() => {
        inputIdAtom.set(id)
      }, 100)
    } else {
      inputIdAtom.set(isOpen ? defaultValue : id)
    }
  }, [id])

  return {
    id,
    isOpen: isCurrentlyOpen,
    toggle,
  }
}

export const inputOverlayManager = {
  store: inputIdAtom,
  use: useInputOverlay,
  toggle: toggleOverlay,
  closeAll: closeInputOverlays,
}
