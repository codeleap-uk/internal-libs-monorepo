import { useBooleanToggle } from './useBooleanToggle'

export function useModal(startsOpen = false) {
  const [visible, toggle] = useBooleanToggle(startsOpen)

  return {
    visible, 
    toggle,
  }
}
