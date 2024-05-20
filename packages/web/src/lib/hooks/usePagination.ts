import { TypeGuards, onUpdate, range, useMemo, useState, useUncontrolled } from '@codeleap/common'

const DOTS = '...'

export type PaginationParams = {
  initialPage?: number
  page?: number
  total: number
  boundaries?: number
  onChange?: (page: number) => void
  shouldAbreviate?: boolean
  abreviationMinimumAmount?: number
  displayLeftArrow?: boolean
  displayRightArrow?: boolean
}

export function usePagination(props: PaginationParams) {

  const {
    total,
    boundaries = 1,
    page,
    initialPage = 1,
    onChange,
    shouldAbreviate = true,
    abreviationMinimumAmount = 10,
    displayLeftArrow = true,
    displayRightArrow = true,
  } = props

  const [activePage, setActivePage] = useUncontrolled({
    value: page,
    onChange,
    defaultValue: 14,
    finalValue: initialPage,
    rule: (_page) => typeof _page === 'number' && _page <= total,
  })

  const [status, setStatus] = useState('initial')

  const leftArrowDisplay = displayLeftArrow ? 'arrow' : null
  const rightArrowDisplay = displayRightArrow ? 'arrow' : null
  const arrowsAmount = !leftArrowDisplay || rightArrowDisplay ? 1 : 2

  const canAbreviateItems = shouldAbreviate && total > abreviationMinimumAmount
  const displayLastNumbers = activePage + boundaries + arrowsAmount + 2 >= total
  const isCenterSelected = canAbreviateItems && activePage > boundaries && !displayLastNumbers

  const dotsDisplay = isCenterSelected ? DOTS : null

  const setPage = (pageNumber: number) => {

    const isPreviousArrow = pageNumber === 0
    const isNextArrow = pageNumber === total + 1

    const nonSelectableItems = [
      TypeGuards.isString(pageNumber) && pageNumber === DOTS,
      isPreviousArrow,
      isNextArrow,
    ].some(x => x)

    if (nonSelectableItems) return activePage
    setActivePage(pageNumber)
  }

  const next = () => setPage(activePage + 1)
  const previous = () => setPage(activePage - 1)
  const first = () => setPage(1)
  const last = () => setPage(total)

  onUpdate(() => {

    if (isCenterSelected) {
      return setStatus('abreviated')
    }

    if (displayLastNumbers) {
      return setStatus('end')
    }

    setStatus('initial')

  }, [activePage, isCenterSelected, displayLastNumbers])

  const paginationRange = useMemo((): (number | string | '...')[] => {

    if (!canAbreviateItems) {
      return [
        leftArrowDisplay,
        ...range(1, total),
        rightArrowDisplay,
      ].filter(Boolean)
    }

    if (displayLastNumbers) {
      return [
        leftArrowDisplay,
        1,
        DOTS,
        ...range(total - (boundaries + 3), total + 1), // boundaries + 3 seria 2 arrows mais o 1ali de cima
      ].filter(Boolean)
    }

    return [
      leftArrowDisplay,
      ...range(1, isCenterSelected ? boundaries - 1 : boundaries),
      dotsDisplay,
      isCenterSelected ? activePage : DOTS,
      dotsDisplay,
      ...range(total - boundaries + (isCenterSelected ? 2 : 1), total),
      rightArrowDisplay,
    ].filter(Boolean)

  }, [total, activePage, displayLastNumbers, isCenterSelected, canAbreviateItems])

  return {
    range: paginationRange,
    active: Number(activePage),
    status,
    setPage,
    next,
    previous,
    first,
    last,
  }
}
