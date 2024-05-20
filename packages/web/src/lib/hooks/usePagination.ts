import { TypeGuards, range, useMemo, useUncontrolled } from '@codeleap/common'

export const DOTS = '...'

export interface PaginationParams {
  initialPage?: number
  page?: number
  total: number
  siblings?: number
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
    siblings = 1,
    boundaries = 1,
    page,
    initialPage = 1,
    onChange,
    shouldAbreviate = true,
    abreviationMinimumAmount = 10,
    displayLeftArrow = true,
    displayRightArrow = true,
  } = props

  const leftArrowDisplay = displayLeftArrow ? 'arrow' : null
  const rightArrowDisplay = displayRightArrow ? 'arrow' : null

  const arrowsAmount = !leftArrowDisplay || rightArrowDisplay ? 1 : 2

  const [activePage, setActivePage] = useUncontrolled({
    value: page,
    onChange,
    defaultValue: 15,
    finalValue: initialPage,
    rule: (_page) => typeof _page === 'number' && _page <= total,
  })

  const setPage = (pageNumber: number) => {

    if (TypeGuards.isString(pageNumber) && pageNumber === DOTS) return activePage

    if (pageNumber <= 0) {
      setActivePage(1)
    } else if (pageNumber > total) {
      setActivePage(total)
    } else {
      setActivePage(pageNumber)
    }
  }

  const next = () => setPage(activePage + 1)
  const previous = () => setPage(activePage - 1)
  const first = () => setPage(1)
  const last = () => setPage(total)

  const isCenterSelected = shouldAbreviate && activePage > boundaries
  const lastNumbersDisplayed = isCenterSelected ? activePage + boundaries + arrowsAmount + 2 >= total : false

  console.log(activePage, 'active page')

  const paginationRange = useMemo((): (number | 'dots')[] => {

    if (total <= abreviationMinimumAmount) {
      return [
        leftArrowDisplay,
        ...range(1, total),
        rightArrowDisplay,
      ].filter(Boolean)
    }

    if (lastNumbersDisplayed) {
      return [
        leftArrowDisplay,
        '1',
        DOTS,
        ...range(total - (boundaries + 3), total + 1), // boundaries + 3 seria 2 arrows mais o 1ali de cima
      ].filter(Boolean)
    }

    return [
      leftArrowDisplay,
      ...range(1, isCenterSelected ? boundaries - 1 : boundaries),
      isCenterSelected ? DOTS : null,
      isCenterSelected ? activePage : DOTS,
      isCenterSelected ? DOTS : null,
      ...range(total - boundaries + (isCenterSelected ? 2 : 1), total),
      rightArrowDisplay,
    ].filter(Boolean)

  }, [total, siblings, activePage, lastNumbersDisplayed, isCenterSelected])

  return {
    range: paginationRange,
    active: Number(activePage),
    lastNumbersDisplayed,
    setPage,
    next,
    previous,
    first,
    last,
  }
}
