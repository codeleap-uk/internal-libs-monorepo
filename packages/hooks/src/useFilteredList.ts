import { useMemo } from 'react'

/**
 * Hook that filters out the first item from a list that matches a predicate.
 *
 * @example
 * const filteredUsers = useFilteredList(users, (user) => user.id === deletedId)
 * // Returns users array without the first user matching the predicate
 */
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
