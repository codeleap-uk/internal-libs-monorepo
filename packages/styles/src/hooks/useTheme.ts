import { ThemeState, themeStoreComputed } from '../theme'
import { useStore } from '@nanostores/react'

type ThemeSelector<T> = (state: ThemeState) => T

export const useTheme = <T = ThemeState>(
  selector?: ThemeSelector<T>
): T => {
  const state = useStore(themeStoreComputed)
  
  if (!selector) {
    return state as T
  }
  
  return selector(state)
}
