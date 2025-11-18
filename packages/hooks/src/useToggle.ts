import { useState } from 'react'

/**
 * Hook that toggles between two values.
 *
 * @example
 * const [theme, toggleTheme] = useToggle(['light', 'dark'] as const, 'light')
 * toggleTheme() // Switches to 'dark'
 * toggleTheme('light') // Sets to 'light'
 */
export function useToggle<T extends readonly [any, any], V extends T[0] | T[1]>(
  options: T,
  initial: V,
) {
  const [value, setValue] = useState(initial)

  function toggleOrSetValue(newValue?: V) {
    const v: V = newValue || (value === options[0] ? options[1] : options[0])

    setValue(v)
  }

  return [value, toggleOrSetValue] as const
}
