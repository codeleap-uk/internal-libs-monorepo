import { useMemo, useState } from 'react'

function range(start: number, end: number) {
  const length = end - start + 1
  return Array.from({ length }, (_, index) => index + start)
}

export interface PaginationParams {
    initialPage?: number
    page?: number
    total: number
    siblings?: number
    boundaries?: number
    onChange?: (page: number) => void
  }

export const DOTS = '...'

export const usePagination = ({
  total,
  siblings = 1,
  boundaries = 1,
  page,
  initialPage = 1,
  onChange,
}: PaginationParams) => {

  const _total = Math.max(Math.trunc(total), 0)
  const [currentPage, setCurrentPage] = useState(initialPage)

  const setNextPage = () => {
    setCurrentPage((state) => state + 1)
    onChange?.(currentPage)
  }

  const setPreviousPage = () => {
    setCurrentPage((state) => state - 1)
    onChange?.(currentPage)
  }

  const setPageNumber = (number: number) => {
    setCurrentPage(number)
    onChange?.(currentPage)
  }

  const paginationRange = useMemo((): (number | 'dots')[] => {
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2
    if (totalPageNumbers >= _total) {
      return range(1, _total)
    }

    const leftSiblingIndex = Math.max(currentPage - siblings, boundaries)
    const rightSiblingIndex = Math.min(currentPage + siblings, _total - boundaries)

    const shouldShowLeftDots = leftSiblingIndex > boundaries + 2
    const shouldShowRightDots = rightSiblingIndex < _total - (boundaries + 1)

    // if (!shouldShowLeftDots && shouldShowRightDots) {
    //   const leftItemCount = siblings * 2 + boundaries + 2
    //   return [...range(1, leftItemCount), DOTS, ...range(_total - (boundaries - 1), _total)]
    // }

    // if (shouldShowLeftDots && !shouldShowRightDots) {
    //   const rightItemCount = boundaries + 1 + 2 * siblings
    //   return [...range(1, boundaries), DOTS, ...range(_total - rightItemCount, _total)]
    // }

    return [
      ...range(1, boundaries),
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...range(_total - boundaries + 1, _total),
    ]
  }, [_total, siblings, currentPage])

  return {
    setNextPage,
    setPreviousPage,
    setPageNumber,
    page,
    range: paginationRange,
    currentPage,
  }

}
