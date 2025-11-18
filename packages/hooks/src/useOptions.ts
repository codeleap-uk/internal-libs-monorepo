import { useMemo, useState } from 'react'

/**
 * Hook that manages selected option state with boolean flags for each option.
 *
 * @example
 * const { selectedOption, setSelectedOption, isSelected } = useOptions(['light', 'dark'] as const)
 * // isSelected = { light: true, dark: false }
 * setSelectedOption('dark')
 * // isSelected = { light: false, dark: true }
 */
export function useOptions<T extends string>(options: readonly T[], initialOptions: T = options[0]) {
  const [selectedOption, setSelectedOption] = useState<T>(initialOptions)

  const isSelected = useMemo(() => {
    return options.reduce((acc, option) => {
      acc[option] = option === selectedOption
      return acc
    }, {} as Record<T, boolean>)
  }, [selectedOption, options])

  return {
    selectedOption,
    setSelectedOption,
    isSelected,
  }
}
