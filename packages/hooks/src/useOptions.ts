import { useMemo, useState } from 'react'

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