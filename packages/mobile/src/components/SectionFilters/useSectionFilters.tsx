import { deepEqual, TypeGuards } from '@codeleap/common'
import React, { useCallback, useMemo } from 'react'

export type TSectionFilterItem = {
  value?: string | number
  label?: string
}

type Section<T = TSectionFilterItem> = {
  data: T[]
  title: string
  selectionLimit?: number
  disableItemsOnLimitReached?: boolean
}

type SelectedItemsPerSection<T = TSectionFilterItem> = { [X: number]: T[] }

export type UseSectionFilters<T = TSectionFilterItem> = {
  sections: Section<T>[]
  areItemsEqual?: (a: T, b: T) => boolean
  selectionLimit?: number
  sectionSelectionLimit?: number
  disableItemsOnLimitReached?: boolean
  initialSelectedItems?: SelectedItemsPerSection<T>
}

export function useSectionFilters<T = TSectionFilterItem>(props: UseSectionFilters<T>) {
  const {
    sections,
    areItemsEqual = deepEqual,
    selectionLimit = 1,
    sectionSelectionLimit = null,
    disableItemsOnLimitReached = selectionLimit > 1 && !sectionSelectionLimit,
    initialSelectedItems = [],
  } = props

  const [selectedItems, setSelectedItems] = React.useState<SelectedItemsPerSection<T>>(() => {
    if (TypeGuards.isArray(initialSelectedItems)) {
      return {
        0: initialSelectedItems,
      }
    }

    return initialSelectedItems ?? {}
  })

  const changed = useCallback(() => {
    return Object.entries(selectedItems).some(([sectionIndex, items]) => {
      const initialItems = initialSelectedItems[sectionIndex] ?? []

      if (!initialItems) {
        return items.length > 0
      }

      if (items.length !== initialItems.length) {
        return true
      }

      return items.some((item) => !initialItems.some((i) => areItemsEqual(i, item)))
    })
  }, [selectedItems, initialSelectedItems])

  const getAllItems = () => {
    return sections?.flatMap((section) => section.data) ?? []
  }

  const findItemSection = (item: T) => {
    if (!sections) {
      return {
        sectionIndex: 0,
        section: null,
      }
    }

    const sectionIndex = sections?.findIndex((section) => {
      return section.data.some((i) => areItemsEqual(item, i))
    })

    if (sectionIndex === -1) {
      return {
        sectionIndex: null,
        section: null,
      }
    }

    const section = sections[sectionIndex]

    return {
      sectionIndex,
      section,
    }
  }

  const isSelected = (item: T) => {
    if (sections) {
      const { sectionIndex } = findItemSection(item)

      return selectedItems[sectionIndex]?.some((i) => areItemsEqual(i, item))
    }

    return selectedItems[0]?.some((i) => areItemsEqual(i, item))
  }

  const toggleItem = (item: T) => {
    let sectionIndex = -1
    let limit = selectionLimit

    if (sections) {
      const { sectionIndex: si, section } = findItemSection(item)

      if (si === null) {
        return
      }

      sectionIndex = si
      limit = section.selectionLimit ?? selectionLimit
    } else {
      sectionIndex = 0
    }

    if (selectionLimit === 1) {
      setSelectedItems({
        [sectionIndex]: [item],
      })
      return
    }

    const currentItems = selectedItems[sectionIndex] ?? []

    const isItemSelected = currentItems.some((i) => areItemsEqual(i, item))

    const newItems = [...currentItems]

    if (isItemSelected) {
      const index = newItems.findIndex((i) => areItemsEqual(i, item))

      newItems.splice(index, 1)
    } else {
      if (newItems.length >= limit) {
        newItems.shift()
      }

      newItems.push(item)
    }

    setSelectedItems({
      ...selectedItems,
      [sectionIndex]: newItems,
    })
  }

  function sectionLimitReached(sectionIndex: number) {
    const section = sections[sectionIndex]

    if (!section) {
      return false
    }

    const limit = section.selectionLimit ?? sectionSelectionLimit ?? selectionLimit

    if (!limit) {
      return false
    }

    const nItems = selectedItems[sectionIndex]?.length

    return nItems >= limit
  }

  function limitReached() {
    const nItems = Object.values(selectedItems).flatMap((i) => i).length

    return nItems >= selectionLimit
  }

  function clearSelectedItemsWithSection(sectionIndex: number) {
    setSelectedItems({
      ...selectedItems,
      [sectionIndex]: [],
    })
  }

  return {
    isSelected,
    toggleItem,
    findItemSection,
    selectedItems,
    sectionLimitReached,
    limitReached,
    disableItemsOnLimitReached,
    clearSelectedItemsWithSection,
    changed,
    areItemsEqual,
    getAllItems,
  }
}
