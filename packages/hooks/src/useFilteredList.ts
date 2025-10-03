import { useMemo } from 'react'

export function useFilteredList<T>(list: T[], predicate: (item: T) => boolean): T[] {
    return useMemo(() => {
        if (!list) return []

        const index = list.findIndex(predicate)
        if (index === -1) return list

        const newList = [...list]
        newList.splice(index, 1)
        return newList
    }, [list, predicate])
}
