import { useBooleanToggle } from '@codeleap/hooks'
import { globalState } from '@codeleap/store'
import { useCallback } from 'react'
import { useId } from '@codeleap/hooks'

const inputOverlayStore = globalState({})

export const useInputOverlay = (autoClosePeersOverlays: boolean, providedId?: string) => {
  if (!autoClosePeersOverlays) return useBooleanToggle(false)

  const id = useId(providedId)

  const isOpen = inputOverlayStore.use(state => state[id])

  const toggle = useCallback(() => {
    const isCurrentlyOpen = inputOverlayStore.value[id]
    const isAnyOtherOpen = Object.entries(inputOverlayStore.value).some(
      ([key, isOpen]) => key !== id && isOpen
    )

    const newValues = Object.keys(inputOverlayStore.value).reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {} as Record<string, boolean>)

    if (isAnyOtherOpen && !isCurrentlyOpen) {
      inputOverlayStore.set(newValues)

      setTimeout(() => {
        inputOverlayStore.set({ [id]: true })
      }, 100)
    } else {
      inputOverlayStore.set({ ...newValues, [id]: !isCurrentlyOpen })
    }
  }, [])

  return [isOpen, toggle]
}